const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET_DEV = require('../JWT_SECRET_DEV');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const ValidationError = require('../errors/validation-err');
const ConflictError = require('../errors/conflict-err');
const СastError = require('../errors/cast-err');

const User = require('../models/user');
const {
  noUser,
  forbidden,
  wrongId,
  passwordNotEhoughLong,
  doubleEmail,
} = require('../constants/constants.js');

const getUser = async (req, res, next) => {
  try {
    try {
      const user = await User.findById(req.user._id)
        .orFail(() => { throw new NotFoundError(noUser); });
      if (user._id.toString() === req.user._id) {
        res.send({ data: user });
      } else {
        throw new ForbiddenError(forbidden);
      }
    } catch (err) {
      if (err.name === 'CastError') {
        throw new СastError(wrongId);
      } else {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  try {
    if (password < 8) {
      throw new ValidationError(passwordNotEhoughLong);
    }
    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name, email, password: hash,
      });
      res.status(201).send({ data: user.omitPrivate() });
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      } else if (err.name === 'MongoError') {
        throw new ConflictError(doubleEmail);
      } else {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV,
    );
    res.status(201);
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
      .send({ data: user.omitPrivate() });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('jwt');
    res.status(200).send({ message: 'ok' });
    next();
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getUser, login, createUser, logout,
};
