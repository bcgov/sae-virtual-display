import { useContext, useEffect, useState } from 'react';

import WorkbenchContext from '@src/utils/context';

function useHelp(id) {
  const { appName, help } = useContext(WorkbenchContext);
  const [content, setContent] = useState([]);

  useEffect(() => {
    async function request() {
      const res = await fetch(`${help.url}/api/v1/article/${appName}/${id}`);
      const json = await res.json();
      setContent(json);
    }
    request();
  }, [help, id]);

  return content;
}

export default useHelp;
