import { useCallback, useMemo } from 'react';
import isNil from 'lodash/isNil';

function useLocationStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key);
  const value = useMemo(() => {
    console.log(storedValue);
    return isNil(storedValue) ? defaultValue : JSON.parse(storedValue);
  }, [defaultValue, storedValue]);

  const save = useCallback(
    value => {
      if (!isNil(value)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    },
    [key],
  );

  return [value, save];
}

export default useLocationStorage;
