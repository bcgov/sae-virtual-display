export function extract(newTheme, { appearance, state, mode }) {
  if (!newTheme[appearance]) return;
  const root = newTheme[appearance];
  return Object.keys(root).reduce((acc, val) => {
    let node = root;
    [val, state, mode].forEach(item => {
      if (!node[item]) return;
      if (typeof node[item] !== 'object') {
        acc[val] = node[item];
        return;
      }
      node = node[item];
      return;
    });
    return acc;
  }, {});
}
