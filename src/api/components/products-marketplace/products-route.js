const express = require('express');

const celebrate = require('../../../core/celebrate-wrappers');
const productsControllers = require('./products-controller');
const productsValidator = require('./products-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/products', route);

  // Get list of products
  route.get('/', productsControllers.getProducts);

  // Create product
  route.post(
    '/',
    celebrate(productsValidator.createProduct),
    productsControllers.createProduct
  );

  // Get product detail
  route.get('/:id', productsControllers.getProduct);

  // Update product
  route.put(
    '/:id',
    celebrate(productsValidator.updateProduct),
    productsControllers.updateProduct
  );

  // Delete product
  route.delete('/:id', productsControllers.deleteProduct);
};
