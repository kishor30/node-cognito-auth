const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
const server = awsServerlessExpress.createServer(app)


module.exports.universal = (event, context,callback) => awsServerlessExpress.proxy(server, event, context,'CALLBACK',
callback);