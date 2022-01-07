const products = require("./db").db("Shopify").collection("notes");

//reqiure object id order to access Documentation based on id
const ObjectId = require("mongodb").ObjectId;

const save = async ({ id, title, status, vendor }) => {
  const result = await products.insertMany({ id, title, status, vendor });
  return result;
};

const getAll = async () => {
  const cursor = await products.find();
  return cursor.toArray();
};

const getById = async (id) => {
  return await products.findOne({ _id: ObjectId(id) });
};

const update = async (id, { name, discription, qty, price }) => {
  const result = await products.replaceOne(
    { _id: ObjectId(id) },
    { name, discription, qty, price }
  );
  return result;
};

const removeById = async (id) => {
  return await products.deleteOne({ _id: ObjectId(id) });
};

module.exports = { save, update, getAll, getById, removeById };
