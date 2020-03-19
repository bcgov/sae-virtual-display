jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());
jest.mock('express', () => require('jest-express'));

const { Express } = require('jest-express/lib/express');
const fetchMock = require('node-fetch');
const auth = require('../auth');

const token = '123';
const url = 'https://help-api/api/public/authenticate';
const credentials = 'Ei%sd0sdIEdis';
const host = 'https://help-api/api';
let app = null;

describe('middleware/auth', () => {
  beforeEach(() => {
    app = new Express();
  });

  afterEach(() => {
    app.resetMocked();
    fetchMock.mockClear();
    fetchMock.reset();
  });

  it('should initialize wth correct credentials', async () => {
    fetchMock.post(url, {
      token,
    });

    auth({
      host,
      credentials,
    });

    expect(fetchMock).toHaveLastFetched(url, 'post');
    expect(fetchMock.lastOptions()).toEqual({
      headers: {
        Authorization: `Basic ${credentials}`,
        'Cache-Control': 'no-cache',
      },
      method: 'POST',
    });
  });

  it('should throw if missing details', async () => {
    fetchMock.post(url, 503);
    expect(
      auth({
        host,
      }),
    ).toThrow();

    app.get('/', req => {
      expect(req.token).toBeFalsy();
    });
  });

  it('should attach a token to the request object', async () => {
    fetchMock.post(url, {
      token,
    });
    const req = {};
    const next = jest.fn();
    const cb = auth({
      host,
      credentials,
    });

    cb(req, {}, next);
    expect(req.token).toEqual(token);
    expect(next).toHaveBeenCalled();
  });
});
