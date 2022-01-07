const { MongoClient } = require("mongodb");
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
// const dbName = '';

// Use connect method to connect to the server
client.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  console.log("Connected successfully to server");
});

// const db = client.db(dbName);
// const collection = db.collection('documents');

// the following code examples can be pasted here...

module.exports = client;
