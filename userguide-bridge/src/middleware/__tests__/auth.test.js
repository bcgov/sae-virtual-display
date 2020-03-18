jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());
const { Response } = require('jest-express/lib/response');

const auth = require('../auth');

const fetchMock = require('node-fetch');
let response = null;

describe('middleware/auth', () => {
  beforeEach(() => {
    response = new Response();
  });

  afterEach(() => {
    response.resetMocked();
    fetchMock.mockClear();
  });

  it('should work', async () => {
    auth();
    expect(fetchMock).toHaveLastFetched(
      'https://help-api/api/public/authenticate',
      'post',
    );
  });
});
