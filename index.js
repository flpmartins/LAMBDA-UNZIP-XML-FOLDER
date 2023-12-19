const addCors = require('./src/helpers/cors/addCors')
const logger = require('./src/helpers/logger/logger')

const getRequestData = require('./src/helpers/getRequestData/getRequestData')
const { helloWorld } = require('./src/core/handlers/hello-world')
const { listS3Objects } = require('./src/core/handlers/listS3Objects')

const originHandler = async (event, context) => {
  try {
    logger.info(`start lambda function [${context.functionName}]`)

    const requestData = await getRequestData(event)

    const result1 = await helloWorld(requestData)

    const result2 = await listS3Objects(requestData)

    return {
      statusCode: 200,
      body: JSON.stringify({ result2 }),
    };

  } catch (err) {
    logger.error(err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
}

exports.handler = addCors(originHandler);
