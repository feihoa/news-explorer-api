const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');

const helmet = require('helmet');
const { notFound } = require('./constants/constants.js');
const limiter = require('./limiter');

const errorHandler = require('./middlewares/errorHandler');
const { validateSignIn, validateSignUp } = require('./celebrateSchemas');

const NotFoundError = require('./errors/not-found-err');

const router = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/Logger');

const { createUser, login, logout } = require('./controllers/users');

const auth = require('./middlewares/auth');

require('dotenv').config();

if (process.env.NODE_ENV !== 'production') { process.env.NODE_ENV = 'development'; }

const { URL_DB } = process.env;

const URLdb = require('./URL_DB');

const app = express();

const corsOptions = {
  origin: ['https://news-explorer-pr.tk', 'http://news-explorer-pr.tk', 'http://localhost:8080', 'http://localhost:8080/', 'https://maliiya.github.io', 'https://maliiya.github.io/'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'x-requested-with', 'origin', 'accept', 'x-access-token', 'Authorization'],
  credentials: true,
};

app.use('*', cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.NODE_ENV === 'production' ? URL_DB : URLdb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,

});

app.use(requestLogger);
app.use(helmet());
app.use(limiter);

// log in
app.post('/signin', validateSignIn, login);

// create user
app.post('/signup', validateSignUp, createUser);

app.use(auth);

app.get('/logout', logout);

app.use(router);

app.use('*', () => {
  throw new NotFoundError(notFound);
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

module.exports = app;
