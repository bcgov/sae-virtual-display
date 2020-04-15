const config = require('config');
const nodeFetch = require('node-fetch');
const fetch = require('fetch-retry')(nodeFetch);

const log = require('../utils/log');

const host = config.get('host');

async function search(token, terms = []) {
  try {
    const keywords = terms.map(a => `"${a}"`).join(' ');
    const response = await fetch(`${host}/search`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        keywords,
        content: false,
        doc: false,
        tag: true,
        attachment: false,
      }),
      retryOn: [401],
      retries: 3,
      retryDelay: 1000,
    });
    const json = await response.json();
    log('[SUCCESS] Found %o article results', json.length);
    return json;
  } catch (err) {
    log('[FAILED] Unable to find articles. Reason: %o', err.message);
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
      retryOn: [401],
      retries: 3,
      retryDelay: 1000,
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
