import React, { useEffect, useState } from 'react';
import { colors } from '@atlaskit/theme';
import isNil from 'lodash/isNil';
import nth from 'lodash/nth';
import sanitize from 'sanitize-html';
import split from 'lodash/split';
import { Spotlight } from '@atlaskit/onboarding';
import { useLocation } from 'react-router-dom';

function Onboarding({ data = [], enabled, onComplete }) {
  const { pathname } = useLocation();
  const [index, setIndex] = useState(null);
  const pageContent = data.filter(d => {
    const [page] = split(d.page.title, '-');
    if (pathname === '/') {
      return page === 'home';
    }
    return pathname.includes(page);
  });
  const sections = pageContent.map(d => d.page && d.page.title);
  const section = nth(pageContent, index);
  const target = nth(sections, index);

  function handleComplete() {
    setIndex(null);
    onComplete();
  }

  useEffect(() => {
    if (enabled) {
      setIndex(0);
    }
  }, [enabled]);

  // There seems to be an ordering issue with the library, so trigger a browser resize
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [index]);

  const renderActions = () => {
    const actions = [];

    if (index + 1 < pageContent.length) {
      actions.push({ onClick: () => setIndex(s => s + 1), text: 'Next' });
    } else {
      actions.push({ onClick: handleComplete, text: 'Finish' });
    }

    if (index > 0) {
      actions.push({ onClick: () => setIndex(s => s - 1), text: 'Prev' });
    }

    return actions;
  };

  if (!isNil(index) && section) {
    return (
      <Spotlight
        actions={renderActions()}
        target={target}
        targetBgColor={colors.N0}
        testId="onboarding"
      >
        <div
          dangerouslySetInnerHTML={{ __html: sanitize(section.page.body) }}
        />
      </Spotlight>
    );
  }

  return null;
}

export default Onboarding;
