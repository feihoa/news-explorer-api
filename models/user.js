const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const AuthorizationError = require('../errors/authorization-err');
const {
  wrongEmail,
  wrongEmailOrPassword,
} = require('../constants/constants.js');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
      message: wrongEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 5,
  },
});

userSchema.methods.omitPrivate = function omitPrivate() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.statics.findUserByCredentials = function f(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError(wrongEmailOrPassword));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationError(wrongEmailOrPassword));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
