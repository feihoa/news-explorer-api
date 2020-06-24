const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const ValidationError = require('../errors/validation-err');
const ConflictError = require('../errors/conflict-err');
const СastError = require('../errors/cast-err');

const User = require('../models/user');

const getUser = async (req, res, next) => {
  // Пр
  try {
    try {
      const user = await User.findById(req.user._id)
        .orFail(() => { throw new NotFoundError('Нет пользователя с таким id'); });
      if (user._id.toString() === req.user._id) {
        res.send({ data: user });
      } else {
        throw new ForbiddenError('Доступ запрещен');
      }
    } catch (err) {
      if (err.name === 'CastError') {
        throw new СastError('Неверный id');
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
      throw new ValidationError('Длина пароля недостаточна');
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
        throw new ConflictError('Такой e-mail уже существует');
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
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
    res.status(201);
    res.cookie('jwt', token, {
      expire: '7d',
      httpOnly: true,
      sameSite: 'strict',
    })
      .send({ data: user.omitPrivate() });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUser, login, createUser,
};
