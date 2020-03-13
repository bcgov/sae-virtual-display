const config = require('config');
const express = require('express');
const fetch = require('node-fetch');

const { fetchArticle } = require('../../middleware/auth');

const host = config.get('host');
const router = express.Router();

router.get('/', req => {
  return 'Nothing to see here';
});

router.get('/article/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const response = await fetch(`${host}/fetch/page/${id}`, {
      headers: {
        Authorization: req.token,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    res.json(json);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
