const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers(page_number, page_size, search, sort) {
  // mengambil daftar users dari repository
  let users = await usersRepository.getUsers();

  // memfilter users berdasarkan email atau nama jika parameter search tersedia atau diisi
  if (search) {
    // memisahkan field yang akan dicari dengan keyword pencarian
    const [fieldName, searchKey] = search.split(':');
    if (fieldName && searchKey) {
      users = users.filter((user) => {
        // jika field yang akan dicari adalah name, maka akan dicari berdasarkan nama
        // jika field yang akan dicari adalah email, maka akan dicari berdasarkan email
        if (fieldName === 'name' && user.name) {
          return user.name.toLowerCase().includes(searchKey.toLowerCase());
        } else if (fieldName === 'email' && user.email) {
          return user.email.toLowerCase().includes(searchKey.toLowerCase());
        }
        // jika field yang akan dicari tidak tersedia, maka akan direturn false
        return false;
      });
    }
  }

  // mengurutkan users berdasarkan name atau email secara asc atau desc jika parameter sort tersedia atau diisi
  if (sort) {
    // memisahkan field yang akan diurutkan dengan urutan asc atau desc
    const [fieldName, sortOrder] = sort.split(':');
    if (fieldName === 'name' || !fieldName) {
      // mengurutkan users berdasarkan name secara asc atau desc
      users.sort((a, b) => {
        const nameA = a.name ? a.name.toLowerCase() : '';
        const nameB = b.name ? b.name.toLowerCase() : '';
        if (sortOrder === 'desc') {
          return nameB.localeCompare(nameA); // mengurutkan secara descending
        } else {
          return nameA.localeCompare(nameB); // mengurutkan secara ascending jika parameter sort tidak diisi (default)
        }
      });
    } else if (fieldName === 'email') {
      // mengurutkan users berdasarkan email secara asc atau desc
      users.sort((a, b) => {
        const emailA = a.email ? a.email.toLowerCase() : '';
        const emailB = b.email ? b.email.toLowerCase() : '';
        if (sortOrder === 'desc') {
          return emailB.localeCompare(emailA); // mengurutkn secara descending
        } else {
          return emailA.localeCompare(emailB); // mengurutkan secara asc jika sort tidak diisi (default)
        }
      });
    }
  }

  // menghitung total halaman berdasarkan jumlah users dan page size
  const totalPages = Math.ceil(users.length / page_size);

  // menghitung indeks awal dan akhir dari data yang akan ditampilkan pada halaman yang diminta
  const startIndex = (page_number - 1) * page_size;
  const endIndex = page_number * page_size;

  // memotong array users untuk menghasilkan data halaman yang diminta
  const paginatedUsers = users.slice(startIndex, endIndex);

  // membuat array hasil yang akan ditampilkan
  const results = [];
  // mengisi array hasil dengan data yang akan ditampilkan
  for (let i = 0; i < paginatedUsers.length; i += 1) {
    const user = paginatedUsers[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  // mengembalikan objek yang berisi informasi halaman dan data users yang merupakan hasil pagination
  return {
    page_number: page_number,
    page_size: page_size,
    count: paginatedUsers.length,
    total_pages: totalPages,
    has_previous_page: page_number > 1, // menentukan apakah halaman sebelumnya tersedia
    has_next_page: page_number < totalPages, // menentukan apakah halaman berikutnya tersedia
    data: results, // data users yang sudah dipagination
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
