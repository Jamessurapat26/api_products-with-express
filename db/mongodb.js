const { MongoClient } = require("mongodb");

const uri = process.env?.mongo_url;
const dbName = process.env?.mongodb_db_name;

const instant = {
  getMongoClient: () => {
    return new MongoClient(uri);
  },
  getDbName: () => {
    return dbName;
  },
};

module.exports = instant;
