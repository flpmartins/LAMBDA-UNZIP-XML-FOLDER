const AdmZip = require('adm-zip')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const listS3Objects = async () => {
  try {
    const params = {
      Bucket: 'flpmartins',
    };

    const data = await s3.listObjectsV2(params).promise()
    const files = data.Contents.map((obj) => obj.Key)

    const zipFiles = files.filter((file) => file.endsWith('.zip'))
    const xmlFiles = files.filter((file) => file.endsWith('.xml'))

    for (const zipFile of zipFiles) {
      const zipData = await s3.getObject({ Bucket: 'flpmartins', Key: zipFile }).promise()
      const zip = new AdmZip(zipData.Body);

      const zipEntries = zip.getEntries();
      for (const entry of zipEntries) {
        const entryData = zip.readFile(entry);

        await s3.putObject({
          Bucket: 'flpmartins',
          Key: entry.entryName,
          Body: entryData,
        }).promise();
      }

      await s3.deleteObject({
        Bucket: 'flpmartins',
        Key: zipFile,
      }).promise();
    }

    const folderExists = files.includes('xml-folder');
    if (!folderExists) {
      await s3.putObject({
        Bucket: 'flpmartins',
        Key: 'xml-folder/',
        Body: '',
      }).promise();
    }

    for (const xmlFile of xmlFiles) {
      const destinationKey = `xml-folder/${xmlFile}`;

      await s3.copyObject({
        Bucket: 'flpmartins',
        CopySource: `/flpmartins/${xmlFile}`,
        Key: destinationKey,
      }).promise();

      await s3.deleteObject({
        Bucket: 'flpmartins',
        Key: xmlFile,
      }).promise();
    }

    return JSON.stringify({ message: 'Lambda acionada com sucesso' })

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};

module.exports = { listS3Objects }
