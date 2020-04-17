import { processData } from '../utils';
import { defaultState } from '../reducer';

import { apps, data } from './data';

describe('views/servers/utils', () => {
  describe('#processData', () => {
    it('should search data', () => {
      const result = processData(
        { ...defaultState, search: 'chrome' },
        apps,
        data,
      );
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          name: 'browser',
        }),
      );
    });

    it('should ignore blank strings', () => {
      const result = processData({ ...defaultState, search: '  ' }, apps, data);
      expect(result.length).toEqual(3);
    });

    it('should hide idle apps', () => {
      const result = processData(
        { ...defaultState, hideIdle: true },
        apps,
        data,
      );
      expect(result.length).toEqual(2);
      expect(result[0]).toEqual(
        expect.objectContaining({
          name: 'notebook',
        }),
      );
    });

    it('should sort in the correct order', () => {
      const result1 = processData(defaultState, apps, data);
      expect(result1.map(d => d.name)).toEqual([
        'browser',
        'notebook',
        'rstudio',
      ]);

      const result2 = processData(
        { ...defaultState, sort: 'ready' },
        apps,
        data,
      );
      expect(result2.map(d => d.name)).toEqual([
        'notebook',
        'rstudio',
        'browser',
      ]);
    });
  });
});
