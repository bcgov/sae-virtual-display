jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());
const fetchMock = require('node-fetch');

const { getDocument, search } = require('../help-provider');
fetchMock.config.overwriteRoutes = true;
const result = [
  {
    id: 'container-1',
    page: {},
  },
];
const results = [
  {
    id: '111a',
    itemType: 'tag',
    documentId: '111b',
    documentSlug: 'sae-onboarding',
    document: 'SAE Onboarding',
    tags: '#bbsae#onboarding#',
  },
];
fetchMock
  .get('https://help-api/api/fetch/page/111b', result)
  .post('https://help-api/api/search', results);

describe('services/help-provider', () => {
  describe('#search', () => {
    it('should search', async () => {
      await expect(search('123', 'onboarding')).resolves.toEqual(results);
      expect(fetchMock).toHaveLastFetched(
        'https://help-api/api/search',
        'post',
      );
      expect(fetchMock.mock.calls[0][1]).toEqual(
        expect.objectContaining({
          method: 'POST',
          headers: {
            Authorization: 'Bearer 123',
            'Cache-Control': 'no-cache',
          },
          body:
            '{"keywords":"onboarding","content":false,"doc":false,"tag":true,"attachment":false}',
        }),
      );
    });

    it('should throw on search failure', async () => {
      fetchMock.post('https://help-api/api/search', 500);

      try {
        await search('123', null);
      } catch (e) {
        expect(e).not.toBeFalsy();
      }
    });
  });

  describe('#getDocument', () => {
    it('should return a document', async () => {
      await expect(getDocument('123', '111b')).resolves.toEqual(result);
      expect(fetchMock).toHaveLastFetched(
        'https://help-api/api/fetch/page/111b',
        'get',
      );
    });

    it('should throw on search failure', async () => {
      fetchMock.get('https://help-api/api/fetch/page/123123', 500);

      try {
        await getDocument('123', null);
      } catch (e) {
        expect(e).not.toBeFalsy();
      }
    });
  });
});
