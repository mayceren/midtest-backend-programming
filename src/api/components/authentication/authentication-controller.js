const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

const failedLoginAttempts = {}; // Objek untuk menyimpan jumlah percobaan login yang gagal dan waktu terakhir percobaan login untuk setiap email

async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // memeriksa apakah sebelumnya ada failed login attempts untuk email yang diberikan
    if (failedLoginAttempts[email]) {
      // mendapatkan waktu terakhir percobaan login dan jumlah percobaan login
      const lastFailed = failedLoginAttempts[email].time;
      // menghitung waktu yang sudah berlalu sejak percobaan login terakhir
      const elapsedTime = Date.now() - lastFailed;
      // 30 menit dalam milisecond
      const thirtyMin = 30 * 60 * 1000;

      // memeriksa apakah waktu yang sudah berlalu kurang dari 30 menit dan jumlah percobaan login lebih dari 5
      if (elapsedTime < thirtyMin && failedLoginAttempts[email].count >= 5) {
        // jika iya, maka kirim respon error
        throw errorResponder(
          errorTypes.FORBIDDEN,
          'Too many failed login attempts. Please try again later.'
        );
      } else if (elapsedTime >= thirtyMin) {
        // jika tidak, maka reset data login attempts
        delete failedLoginAttempts[email];
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    // jika login gagal, maka tambahkan data login attempts
    if (!loginSuccess) {
      // jika belum ada data login attempts, maka buat data baru
      if (!failedLoginAttempts[email]) {
        failedLoginAttempts[email] = { count: 1, time: Date.now() };
      } else {
        // jika sudah ada data login attempts, maka tambahkan data login attempts
        failedLoginAttempts[email].count++;
        failedLoginAttempts[email].time = Date.now();
      }

      // kirim respon error untuk login yang salah memasukkan email atau password
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    // jika login berhasil, maka hapus data login attempts (jika ada)
    delete failedLoginAttempts[email];

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
