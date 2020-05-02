import React from 'react';
import StarButton from '@src/components/core/buttons/star';
import useLocalStorage from '@src/hooks/use-localstorage';

function StarredView({ id }) {
  const [starred, save] = useLocalStorage('starred', { initialValue: [] });
  const isStarred = starred.includes(id);

  function onClick(id) {
    save(isStarred ? starred.filter(d => d !== id) : [...starred, id]);
  }

  return <StarButton id={id} starred={isStarred} onClick={onClick} />;
}

export default StarredView;
