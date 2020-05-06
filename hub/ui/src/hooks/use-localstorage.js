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
    (sourceKey, sourceId, newValue) => {
      if (key === sourceKey && id !== sourceId && !isEqual(value, newValue)) {
        save(newValue);
      }
    },
    [id, key, save, value],
  );

  useEffect(() => {
    if (!isEqual(value, initialValue)) {
      localStorage.setItem(key, JSON.stringify(value));
      events.emit('store', key, id, value);
    }
  }, [id, initialValue, key, save, value]);

  useEffect(() => () => events.off('store', eventHandler), [eventHandler]);

  events.on('store', eventHandler);

  return [value, save];
}

export default useLocationStorage;
