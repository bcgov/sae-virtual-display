const config = require('config');
const express = require('express');
const fetch = require('node-fetch');

const log = require('../../utils/log');

const host = config.get('host');
const router = express.Router();

router.get('/', () => {
  return 'Nothing to see here';
});

router.get('/article/:app/:keyword', async (req, res, next) => {
  const { token } = req;
  const { app, keyword } = req.params;

  try {
    const searchResults = await searchApi(token, keyword);
    const appRelevantResult = searchResults.find(d => d.tags.includes(app));
    const id = appRelevantResult && appRelevantResult.documentId;
    const document = await getDocument(token, id);
    res.json(document);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

async function searchApi(token, keyword) {
  try {
    const response = await fetch(`${host}/search`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keywords: keyword,
        content: false,
        doc: false,
        tag: true,
        attachment: false,
      }),
    });
    const json = await response.json();
    log('[SUCCESS] Search result found');
    return json;
  } catch (err) {
    log('[FAILED] Search article %o', err.message);
    throw new Error(err);
  }
}

async function getDocument(token, id) {
  try {
    const response = await fetch(`${host}/fetch/page/${id}`, {
      headers: {
        Authorization: token,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    log('[SUCCESS] Search article loaded');
    return json;
  } catch (err) {
    log('[FAILED] Search article %o', err.message);
    throw new Error(err);
  }
}
