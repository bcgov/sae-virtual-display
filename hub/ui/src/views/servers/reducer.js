export const defaultState = {
  hideIdle: false,
  search: '',
  sort: 'name',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'toggle':
      return {
        ...state,
        hideIdle: !state.hideIdle,
      };

    case 'search':
      return {
        ...state,
        search: action.payload,
      };

    case 'sort':
      return {
        ...state,
        sort: action.payload,
      };

    default:
      throw new Error();
  }
};
