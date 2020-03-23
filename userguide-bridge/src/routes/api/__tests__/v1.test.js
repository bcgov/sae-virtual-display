jest.mock('../../../services/help-provider');
const express = require('express');
const request = require('supertest');
const { search, getDocument } = require('../../../services/help-provider');

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
  it('should render empty root', async () => {
    const res = await request(app).get('/');
    expect(res.text).toEqual('Nothing to see here');
  });

  it('should return an error if nothing works', async () => {
    const res = await request(app).get('/article/bbsae/onboarding');
    expect(res.status).toEqual(500);
  });

  it('should forward the correct arguments to the API service', async () => {
    search.mockReturnValue(
      Promise.resolve([
        {
          id: '111a',
          documentId: '111b',
          tags: '#bbsae#onboarding#',
        },
      ]),
    );
    getDocument.mockReturnValue(
      Promise.resolve({
        id: '111',
        name: 'correct',
      }),
    );
    const res = await request(app).get('/article/bbsae/onboarding');
    expect(search).toHaveBeenCalledWith('123', 'onboarding');
    expect(getDocument).toHaveBeenCalledWith('123', '111b');
    expect(res.body).toEqual({ id: '111', name: 'correct' });
  });
});
