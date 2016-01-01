require('./initialize')();

const AWS = require('aws-sdk');
AWS.config.update({
  region: process.env.AWS_REGION,
  // Hardcode to US East for now
  endpoint: process.env.NODE_ENV === 'production' ? 'https://dynamodb.us-east-1.amazonaws.com' : 'http://localhost:8000'
});

module.exports = {DynamoDB: new AWS.DynamoDB(), DynamoDocumentClient: new AWS.DynamoDB.DocumentClient()};
