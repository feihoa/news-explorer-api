const router = require('express').Router();

const {
  getUser,
} = require('../controllers/users');

// get user
router.get('/me', getUser);

module.exports = router;
