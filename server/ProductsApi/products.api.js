const {
  save,
  update,
  getAll,
  getById,
  removeById,
} = require("../db/products.dao");

const createProduct = async ({ id, title, status, vendor }) => {
  const product = { id, title, status, vendor };

  return await save(product);
};

const getProducts = async () => {
  return await getAll();
};

const getProduct = async (id) => {
  return await getById(id);
};

const deleteProduct = async (id) => {
  return await removeById(id);
};

const updateProduct = async (id, { name, discription, qty, price }) => {
  console.log(name);
  return await update(id, { name, discription, qty, price });
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
