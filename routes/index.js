const router = require('express').Router();

const { validateHeaders } = require('../celebrateSchemas');

const usersRouter = require('./users');
const articlesRouter = require('./articles');

router.use('/users', validateHeaders, usersRouter);
router.use('/articles', validateHeaders, articlesRouter);

module.exports = router;
