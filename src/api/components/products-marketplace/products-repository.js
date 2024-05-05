const { Product } = require('../../../models');

/**
 * Get a list of products
 * @returns {Promise}
 */
async function getProducts() {
  return Product.find({});
}

/**
 * Get product detail
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Product.findById(id);
}

/**
 * Create new product
 * @param {string} name - Name
 * @param {number} price - Price
 * @param {string} category - Category
 * @param {number} quantity - Quantity
 * @returns {Promise}
 */
async function createProduct(name, price, category, quantity) {
  return Product.create({
    name,
    price,
    category,
    quantity,
  });
}

/**
 * Update existing product
 * @param {string} id - Product ID
 * @param {string} name - Name
 * @param {number} price - Price
 * @param {string} category - Category
 * @param {number} quantity - Quantity
 * @returns {Promise}
 */
async function updateProduct(id, name, price, category, quantity) {
  return Product.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        price,
        category,
        quantity,
      },
    }
  );
}

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
