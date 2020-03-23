const express = require('express');

const { search, getDocument } = require('../../services/help-provider');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Nothing to see here');
});

router.get('/article/:app/:keyword', async (req, res, next) => {
  const { token } = req;
  const { app, keyword } = req.params;

  try {
    const searchResults = await search(token, keyword);
    const appRelevantResult = searchResults.find(d => d.tags.includes(app));
    const id = appRelevantResult && appRelevantResult.documentId;
    const document = await getDocument(token, id);
    res.json(document);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
