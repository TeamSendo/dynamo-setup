require('./initialize')();

const _ = require('lodash');
const tables = require('./tables');
const DynamoDB = require('./dynamodb').DynamoDB;

tables.dynamodb.forEach((tableDefinition) => {
  DynamoDB.describeTable({TableName: tableDefinition.name}, (err, data) => {
    // Only create table if it doesn't already exist
    if (err && err.code === 'ResourceNotFoundException') {
      const indexes = tableDefinition.indexes;
      let tableKeys = tableDefinition.keys;
      if (indexes && indexes.length > 0)
        tableKeys = _.flatten(tableKeys.concat(indexes.map((indexDefinition) => indexDefinition.keys)), true);
      let dynamoParams = {
        "TableName": tableDefinition.name,
        "KeySchema": tableDefinition.keys.map((keyDefinition) => ({
          "AttributeName": keyDefinition.name,
          "KeyType": keyDefinition.keyType
        })),
        "AttributeDefinitions": tableKeys.map((keyDefinition) => ({
          "AttributeName": keyDefinition.name,
          "AttributeType": keyDefinition.attributeType
        })),
        "ProvisionedThroughput": {
          "ReadCapacityUnits": tableDefinition.readCapacity || 1,
          "WriteCapacityUnits": tableDefinition.writeCapacity || 1
        }
      };
      let globalIndexes = undefined;
      if (indexes && indexes.length > 0) {
        let globalIndexes = indexes.filter((indexDefinition) => indexDefinition.type === 'global');
        dynamoParams['GlobalSecondaryIndexes'] = globalIndexes.map((indexDefinition) => ({
          IndexName: indexDefinition.name,
          KeySchema: indexDefinition.keys.map((keyDefinition) => ({
            AttributeName: keyDefinition.name,
            KeyType: keyDefinition.keyType
          })),
          Projection: {
            ProjectionType: 'ALL'  // TODO: Support other projection types
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: indexDefinition.readCapacity || 1,
            WriteCapacityUnits: indexDefinition.writeCapacity || 1
          }
        }));
      }
      console.log(`Creating table ${tableDefinition.name}`);
      DynamoDB.createTable(dynamoParams, (err, data) => {
        if (err)
          console.log(`Error creating table ${tableDefinition.name}: ${err.message}`)
      })
    }
    else
      console.log(`Skipping ${tableDefinition.name} because it exists`)
  })
});
