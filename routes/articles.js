const router = require('express').Router();

const { validateCreateArticle, validateArticleId } = require('../celebrateSchemas');

const {
  getArticles, createArticle, deleteArticle,
} = require('../controllers/articles');

// get all saved articles
router.get('/', getArticles);

// create article
router.post('/', validateCreateArticle, createArticle);

// delete article
router.delete('/:articleId', validateArticleId, deleteArticle);

module.exports = router;
