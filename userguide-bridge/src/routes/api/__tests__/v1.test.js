jest.mock('../../../services/help-provider');
const express = require('express');
const request = require('supertest');
const { getDocument } = require('../../../services/help-provider');

const auth = require('../../../middleware/auth');
const v1 = require('../v1');

const app = express();
app.use(
  auth({
    token: '123',
  }),
);
app.use('/', v1);

describe('api/v1', () => {
  beforeEach(() => {
    app.locals.apps = [
      {
        id: 1,
        tags: '#bbsae#onboarding',
        documentId: '111b',
      },
    ];
  });

  afterEach(() => {
    delete app.locals.apps;
  });

  it('should render empty root', async () => {
    const res = await request(app).get('/');
    expect(res.text).toEqual('Nothing to see here');
  });

  it('should return an error if no articles are in memory', async () => {
    delete app.locals.apps;
    const res = await request(app).get('/article/bbsae/onboarding');
    expect(res.status).toEqual(404);
  });

  it('should throw the correct error', async () => {
    getDocument.mockRejectedValue(new Error('Broken'));
    const res = await request(app).get('/article/bsae/123');
    expect(res.status).toEqual(500);
  });

  it('should forward the correct arguments to the API service', async () => {
    getDocument.mockReturnValue(
      Promise.resolve({
        id: '111',
        name: 'correct',
      }),
    );
    const res = await request(app).get('/article/bbsae/onboarding');

    expect(getDocument).toHaveBeenCalledWith('123', '111b');
    expect(res.body).toEqual({ id: '111', name: 'correct' });
  });
});
