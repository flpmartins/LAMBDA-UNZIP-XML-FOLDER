const { cors } = require('aws-lambda-cors');

const addCors = (handler) => {
  return cors({
    allowCredentials: true,
    allowOrigins: ['*'],
    allowMethods: ['OPTIONS', 'HEAD', 'GET', 'POST', 'PUT', 'PATCH'],
    allowHeaders: ['Authorization', 'Content-Type'],
  })(handler);
};

module.exports = addCors;
