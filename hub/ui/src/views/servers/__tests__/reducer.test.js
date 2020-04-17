import { defaultState, reducer } from '../reducer';

describe('#reducer', () => {
  it('should thow without an action type', () => {
    expect(() => reducer(defaultState, {})).toThrow();
  });

  it('should toggle', () => {
    expect(reducer(defaultState, { type: 'toggle' })).toEqual({
      hideIdle: true,
      search: '',
      sort: 'name',
    });
  });

  it('should search', () => {
    expect(reducer(defaultState, { type: 'search', payload: 'test' })).toEqual({
      hideIdle: false,
      search: 'test',
      sort: 'name',
    });
  });

  it('should sort', () => {
    expect(reducer(defaultState, { type: 'sort', payload: 'ready' })).toEqual({
      hideIdle: false,
      search: '',
      sort: 'ready',
    });
  });
});
