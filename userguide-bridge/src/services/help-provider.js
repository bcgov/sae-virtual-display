const config = require('config');
const fetch = require('cross-fetch');

const log = require('../utils/log');

const host = config.get('host');

async function search(token, keyword) {
  try {
    const response = await fetch(`${host}/search`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
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
    log('[SUCCESS] Found %o article results found', json.length);
    return json;
  } catch (err) {
    log('[FAILED] Search article %o', err.message);
    throw new Error(err);
  }
}

async function getDocument(token, id) {
  try {
    const response = await fetch(`${host}/fetch/page/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
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

module.exports = {
  getDocument,
  search,
};
