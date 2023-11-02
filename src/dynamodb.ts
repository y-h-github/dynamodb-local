import { DynamoDBClient, DynamoDBClientConfig, CreateTableCommand, DeleteTableCommand, ListTablesCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import ItemList from './item.json';

// ローカルDBへの接続定義
const config: DynamoDBClientConfig = {
  endpoint: 'http://localhost:8000',
  region: 'ap-northeast-1',
  credentials: { accessKeyId: 'dummy', secretAccessKey: 'dummy' },
};

const ddbClient = new DynamoDBClient(config);
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient); // DynamoDBClientを抽象化した記述が可能

const TABLE_NAME = 'OrderHistory';

/***************************************
  create table >> use ddbClient
***************************************/
const createTable = async () => {
  try {
    const command = new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [
        { AttributeName: 'CustomerId', KeyType: 'HASH' }, // partition key
        { AttributeName: 'OrderNumber', KeyType: 'RANGE' }, // sort key
      ],
      AttributeDefinitions: [
        { AttributeName: 'CustomerId', AttributeType: 'S' }, // 属性：String
        { AttributeName: 'OrderNumber', AttributeType: 'N' }, // 属性：Number
      ],
      // capacity unit settings
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    });
    const output = await ddbClient.send(command);
    console.log('===================== createTable success =====================\n', JSON.stringify(output, null, 2));
  } catch (err) {
    console.error('===================== createTable error =====================\n', err);
  }
};

/***************************************
  delete table >> use ddbClient
***************************************/
const deleteTable = async () => {
  try {
    const command = new DeleteTableCommand({
      TableName: TABLE_NAME,
    });
    const output = await ddbClient.send(command);
    console.log('===================== deleteTable success =====================\n', JSON.stringify(output, null, 2));
  } catch (err) {
    console.error('===================== deleteTable error =====================\n', err);
  }
};

/***************************************
  list tables >> use ddbClient
***************************************/
const listTables = async () => {
  try {
    const command = new ListTablesCommand({});
    const output = await ddbClient.send(command);
    console.log('===================== listTables success =====================\n', JSON.stringify(output, null, 2));
  } catch (err) {
    console.error('===================== listTables error =====================\n', err);
  }
};

/***************************************
  describe table >> use ddbClient
***************************************/
const describeTable = async () => {
  try {
    const command = new DescribeTableCommand({
      TableName: TABLE_NAME,
    });
    const output = await ddbClient.send(command);
    console.log('===================== describeTable success =====================\n', JSON.stringify(output, null, 2));
  } catch (err) {
    console.error('===================== describeTable error =====================\n', err);
  }
};

/***************************************
  put item >> use ddbDocClient
***************************************/
const putItem = async () => {
  try {
    ItemList.forEach(async (item) => {
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
        // ConditionExpression: 'attribute_not_exists(OrderNumber)',
        ReturnValues: 'NONE',
      });
      const output = await ddbDocClient.send(command);
      console.log('===================== putItem success =====================\n', JSON.stringify(output, null, 2));
    });
  } catch (err) {
    console.error('===================== putItem error =====================\n', err);
  }
};

/***************************************
  update item >> use ddbDocClient
***************************************/
const updateItem = async () => {
  try {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        CustomerId: 'A001',
        OrderNumber: 1,
      },
      UpdateExpression: 'set #product = :product, #price = :price',
      ExpressionAttributeNames: {
        '#product': 'Product',
        '#price': 'Price',
      },
      ExpressionAttributeValues: {
        ':product': 'pine',
        ':price': '110',
      },
      ReturnValues: 'ALL_NEW',
    });
    const output = await ddbDocClient.send(command);
    console.log('===================== updateItem success =====================\n', JSON.stringify(output, null, 2));
  } catch (err) {
    console.error('===================== updateItem error =====================\n', err);
  }
};

/***************************************
  get item >> use ddbDocClient
***************************************/
const getItem = async () => {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        CustomerId: 'A001',
        OrderNumber: 1,
      },
    });
    const output = await ddbDocClient.send(command);
    console.log('===================== getItem success =====================\n', JSON.stringify(output, null, 2));
  } catch (err) {
    console.error('===================== getItem error =====================\n', err);
  }
};

/***************************************
  get item all >> use ddbDocClient
***************************************/
const scan = async () => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });
    const output = await ddbDocClient.send(command);
    console.log('===================== scan success =====================\n', JSON.stringify(output, null, 2));
  } catch (err) {
    console.error('===================== scan error =====================\n', err);
  }
};

/***************************************
  delete item >> use ddbDocClient
***************************************/
const deleteItem = async () => {
  try {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        CustomerId: 'A002',
        OrderNumber: 2,
      },
      ReturnValues: 'ALL_OLD',
    });
    const output = await ddbDocClient.send(command);
    console.log('===================== deleteItem success =====================\n', JSON.stringify(output, null, 2));
  } catch (err) {
    console.error('===================== deleteItem error =====================\n', err);
  }
};

// execute command -> npm run test
(async () => {
  // await createTable();
  // await deleteTable();
  // await listTables();
  // await describeTable();
  // await putItem();
  // await updateItem();
  // await getItem();
  // await scan();
  // await deleteItem();
})();
