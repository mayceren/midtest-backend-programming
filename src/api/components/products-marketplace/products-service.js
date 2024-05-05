const productsRepository = require('./products-repository');

/**
 * Get list of products
 * @returns {Array}
 */
async function getProducts(page_number, page_size, search, sort) {
  // mendapatkan daftar product dari repository
  let products = await productsRepository.getProducts();

  // memfilter product berdasarkan nama atau category jika search diisi
  if (search) {
    // memisahkan nama field yang akan dicari dengan keyword pencarian
    const [fieldName, searchKey] = search.split(':');
    if (fieldName && searchKey) {
      products = products.filter((product) => {
        // jika nama field yang akan dicari adalah name, maka akan dicari berdasarkan nama product
        // jika nama field yang akan dicari adalah category, maka akan dicari berdasarkan category product
        if (fieldName === 'name' && product.name) {
          return product.name.toLowerCase().includes(searchKey.toLowerCase());
        } else if (fieldName === 'category' && product.category) {
          return product.category
            .toLowerCase()
            .includes(searchKey.toLowerCase());
        }
        // jika nama field yang akan dicari tidak ada, maka akan mengembalikan false
        return false;
      });
    }
  }

  // memfilter product berdasarkan nama atau harga jika sort diisi
  if (sort) {
    // memisahkan nama field yang akan dicari dengan keyword pencarian
    const [fieldName, sortOrder] = sort.split(':');
    if (fieldName === 'name' || !fieldName) {
      // memsorting product berdasarkan nama product
      products.sort((a, b) => {
        const nameA = a.name ? a.name.toLowerCase() : '';
        const nameB = b.name ? b.name.toLowerCase() : '';
        if (sortOrder === 'desc') {
          return nameB.localeCompare(nameA); // mengurutkan secara descending
        } else {
          return nameA.localeCompare(nameB); // mengurutkan secara ascending (default)
        }
      });
    } else if (fieldName === 'price') {
      // memsorting product berdasarkan harga product
      products.sort((a, b) => {
        if (sortOrder === 'desc') {
          return b.price - a.price; // mengurutkan secara descending
        } else {
          return a.price - b.price; // mengurutkan secara ascending (default)
        }
      });
    }
  }

  // menghitung total halaman berdasarkan jumlah product dan page size
  const totalPages = Math.ceil(products.length / page_size);

  // menghitung indeks awal dan akhir dari data yang akan ditampilkan pada halaman yang diminta
  const startIndex = (page_number - 1) * page_size;
  const endIndex = page_number * page_size;

  // memotong array product untuk menghasilkan data halaman yang diminta
  const paginatedProducts = products.slice(startIndex, endIndex);

  // menginisialisasi array untuk menyimpan hasil product yang sudah dipagination
  const results = [];
  // mengisi array hasil dengan data yang akan ditampilkan
  for (let i = 0; i < paginatedProducts.length; i += 1) {
    const product = paginatedProducts[i];
    results.push({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
    });
  }

  // mengembalikan hasil pagination
  return {
    page_number: page_number,
    page_size: page_size,
    count: paginatedProducts.length,
    total_pages: totalPages,
    has_previous_page: page_number > 1,
    has_next_page: page_number < totalPages,
    data: results,
  };
}

/**
 * Get product detail
 * @param {string} id - Product ID
 * @returns {Object}
 */
async function getProduct(id) {
  // mendapatkan detail product dari repository berdasarkan id yang diberikan
  const product = await productsRepository.getProduct(id);

  // jika product tidak ditemukan
  if (!product) {
    // mengembalikan null sebagain indikasi bahwa product tidak ditemukan
    return null;
  }

  // jika product ditemukan, mengembalikan objek dengan detail produk yang sesuai
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    quantity: product.quantity,
  };
}

/**
 * Create new product
 * @param {string} name - Name
 * @param {number} price - Harga produk
 * @param {string} category - Kategori produk
 * @param {number} quantity - jumlah produk
 * @returns {boolean}
 */
async function createProduct(name, price, category, quantity) {
  try {
    // Mencoba membuat product baru dengan menggunakan createProduct dari repository
    await productsRepository.createProduct(name, price, category, quantity);
  } catch (err) {
    // Jika terjadi kesalahan saat mencoba membuat produk baru, mengembalikan nilai null
    return null;
  }

  // Jika berhasil membuat product baru, mengembalikan nilai true
  return true;
}

/**
 * Update existing product
 * @param {string} id - Product ID
 * @param {number} price - Harga produk
 * @param {string} category - Kategori produk
 * @param {number} quantity - jumlah produk
 * @returns {boolean}
 */
async function updateProduct(id, name, price, category, quantity) {
  // Mendapatkan detail product dengan menggunakan getProduct dari repository
  const product = await productsRepository.getProduct(id);

  // jika product tidak ditemukan
  if (!product) {
    // mengembalikan nilai null sebagai indikasi bahwa product tidak ditemukan untuk diperbarui
    return null;
  }

  try {
    // mencoba memperbarui detail product dengan updateProduct dari repository
    await productsRepository.updateProduct(id, name, price, category, quantity);
  } catch (err) {
    // jika terjadi error, mengembalikan nilai null sebagai indikasi bahwa product tidak dapat diperbarui
    return null;
  }

  // jika berhasil memperbarui product, mengembalikan nilai true
  return true;
}

/**
 * Delete product
 * @param {string} id - Product ID
 * @returns {boolean}
 */
async function deleteProduct(id) {
  // mendapatkan detail product dari repository
  const product = await productsRepository.getProduct(id);

  // Product not found
  if (!product) {
    // mengembalikan nilai null sebagai indikasi bahwa product tidak ditemukan untuk dihapus
    return null;
  }

  try {
    // mencoba menghapus product berdasarkan id yang diberikan
    await productsRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  // jika berhasil menghapus product, mengembalikan nilai true
  return true;
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
