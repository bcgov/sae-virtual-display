import { useCallback, useEffect, useState } from 'react';
import EventEmitter from 'events';
import isEqual from 'lodash/isEqual';
import uniqueId from 'lodash/uniqueId';

const events = new EventEmitter();
const defaultConfig = {
  initialValue: null,
};

function useLocationStorage(key, config = defaultConfig) {
  const id = uniqueId('ls');
  const initialValue =
    JSON.parse(localStorage.getItem(key)) || config.initialValue;
  const [value, save] = useState(initialValue);
  const eventHandler = useCallback(
    (sourceId, newValue) => {
      if (id !== sourceId && !isEqual(value, newValue)) {
        save(newValue);
      }
    },
    [id, save, value],
  );

  useEffect(() => {
    if (!isEqual(value, initialValue)) {
      localStorage.setItem(key, JSON.stringify(value));
      events.emit('store', id, value);
    }
  }, [id, initialValue, key, save, value]);

  useEffect(() => () => events.off('store', eventHandler), [eventHandler]);

  events.on('store', eventHandler);

  return [value, save];
}

export default useLocationStorage;
