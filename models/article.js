const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const { wrongLink } = require('../constants/constants.js');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: isURL,
      message: wrongLink,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: isURL,
      message: wrongLink,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
    select: false,
  },
});

articleSchema.methods.omitPrivate = function omitPrivate() {
  const obj = this.toObject();
  delete obj.owner;
  return obj;
};

module.exports = mongoose.model('article', articleSchema);
