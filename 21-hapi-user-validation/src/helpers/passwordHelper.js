const Bcrypt = require('bcrypt');

const { promisify } = require('util');

const hashAsync = promisify(Bcrypt.hash);
const compareAsync = promisify(Bcrypt.compare);

const SALT = 3;

const plainTextPassword = "DFGh5546*%^__90";

class PasswordHelper {
  static hashPassword(password) {
    return hashAsync(password, SALT);
  }
  
  static comparePassword(password, hash) {
    return compareAsync(password, hash);
  }

}

module.exports =  PasswordHelper;