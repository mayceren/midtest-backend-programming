const joi = require('joi');

module.exports = {
  createProduct: {
    body: {
      // validasi untuk nama, harga, kategori, dan jumlah produk untuk operasi membuat produk baru
      name: joi.string().min(1).max(100).required().label('Name'),
      price: joi.number().required().label('Price'),
      category: joi.string().min(1).max(100).required().label('Category'),
      quantity: joi.number().integer().required().label('Quantity'),
    },
  },

  updateProduct: {
    body: {
      // validasi untuk nama, harga, kategori, dan jumlah produk untuk operasi update product
      name: joi.string().min(1).max(100).required().label('Name'),
      price: joi.number().required().label('Price'),
      category: joi.string().min(1).max(100).required().label('Category'),
      quantity: joi.number().integer().required().label('Quantity'),
    },
  },
};
