import { useContext, useEffect, useState } from 'react';

import WorkbenchContext from '@src/utils/context';

function useHelp(id) {
  const { helpURL } = useContext(WorkbenchContext);
  const [content, setContent] = useState([]);

  useEffect(() => {
    async function request() {
      const res = await fetch(`${helpURL}/api/v1/article/${id}`);
      const json = await res.json();
      setContent(json);
    }
    request();
  }, [helpURL, id]);

  return content;
}

export default useHelp;
