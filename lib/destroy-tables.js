require('./initialize')();

const tables = require('./tables');
const DynamoDB = require('./dynamodb').DynamoDB;

tables.dynamodb.forEach((tableDefinition) => {
  console.log(`Deleting table ${tableDefinition.name}`);
  DynamoDB.deleteTable({TableName: tableDefinition.name}, (err, data) => {
    if (err)
      return console.error(`Error deleting table ${tableDefinition.name}: ${err.message}`);
  })
});
