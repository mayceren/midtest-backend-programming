const productsService = require('./products-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of products request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducts(request, response, next) {
  try {
    // nomor halaman, jumlah data per-halaman, pengurutan data, dan filter atau pencarian data berdasarkan atribut tertentu
    const page_number = parseInt(request.query.page_number) || 1;
    const page_size = parseInt(request.query.page_size) || 0;
    const search = request.query.search;
    const sort = request.query.sort;

    // memanggil service untuk mendapatkan data product
    const products = await productsService.getProducts(
      page_number,
      page_size,
      search,
      sort
    );
    return response.status(200).json(products);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get product detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    // memanggil service untuk mendapatkan data product
    const product = await productsService.getProduct(request.params.id);

    // jika product tidak ditemukan
    if (!product) {
      // kirim error
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown product');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
    // validasi request body
    const name = request.body.name;
    const price = request.body.price;
    const category = request.body.category;
    const quantity = request.body.quantity;

    // memanggil service untuk membuat product baru dengan data yang diberikan
    const success = await productsService.createProduct(
      name,
      price,
      category,
      quantity
    );
    // jika gagal, kirim error
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create new product'
      );
    }

    return response.status(200).json({ name, price, category, quantity });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    // mengambil id product
    const id = request.params.id;
    // mengambil data product dari request body
    const name = request.body.name;
    const price = request.body.price;
    const category = request.body.category;
    const quantity = request.body.quantity;

    // memanggil service untuk memperbarui product dengan data yang diberikan
    const success = await productsService.updateProduct(
      id,
      name,
      price,
      category,
      quantity
    );
    // jika gagal, kirim error
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product'
      );
    }

    return response.status(200).json({ id, name });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    // ambil id yang akan dihapus dari params
    const id = request.params.id;

    // panggil service untuk menghapus product
    const success = await productsService.deleteProduct(id);
    // jika gagal, kirim error
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
