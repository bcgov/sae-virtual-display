import get from 'lodash/get';
import merge from 'lodash/merge';
import orderBy from 'lodash/orderBy';

export const processData = (state, apps, data) => {
  const { search, sort, hideIdle } = state;
  const regex = new RegExp(search, 'i');
  const items = apps
    .map(d => {
      const server = get(data, `servers.${d.name}`, {});
      return merge(
        {
          lastActivity: new Date().toISOString(),
          pending: '',
          progressUrl: '',
          started: new Date().toISOString(),
          state: {},
          ready: false,
          url: '',
        },
        d,
        server,
      );
    })
    .filter(d => (search.trim() ? d.label.search(regex) >= 0 : true))
    .filter(d => (hideIdle ? d.ready : true));
  const sortOrder = sort === 'ready' ? 'desc' : 'asc';
  const sorted = orderBy(items, [sort], [sortOrder]);
  return sorted;
};
