const { celebrate, Joi } = require('celebrate');

const { default: validator } = require('validator');

// signin

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "email" заполнено некоректно');
    }),
    password: Joi.string().required().min(8),
  }),
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(),
});

// signup

const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),

  }),
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(),
});

// users
// articles

const validateHeaders = celebrate({
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(),
});

// articles/

const validateCreateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2),
    text: Joi.string().required().min(2),
    date: Joi.string().required().min(2).max(30),
    source: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "link" заполнено некоректно');
    }),
    image: Joi.string().required().min(2).custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле "image" заполнено некоректно');
    }),
  }),
});

const validateArticleId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24).pattern(new RegExp('^[0-9a-f]*$')),
  }),
});

module.exports = {
  validateSignIn,
  validateSignUp,
  validateHeaders,
  validateCreateArticle,
  validateArticleId,
};
