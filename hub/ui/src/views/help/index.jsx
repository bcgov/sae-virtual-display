import React, { useContext, useState } from 'react';
import Button from '@atlaskit/button';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import sanitize from 'sanitize-html';
import Spinner from '@atlaskit/spinner';
import useHelp from '@src/hooks/use-help';
import WorkbenchContext from '@src/utils/context';

import { HelpContent, HelpLoading } from './styles';

function Help() {
  const { helpArticles } = useContext(WorkbenchContext);
  const data = useHelp(helpArticles.main);
  const [open, toggleOpen] = useState(false);

  function onToggle() {
    toggleOpen(state => !state);
  }

  return (
    <>
      <Button appearance="primary" onClick={onToggle}>
        Help
      </Button>
      <ModalTransition>
        {open && (
          <ModalDialog
            actions={[{ onClick: onToggle, text: 'Done' }]}
            heading="Help"
            onClose={onToggle}
            width="large"
          >
            {!data.length && (
              <HelpLoading>
                <Spinner />
              </HelpLoading>
            )}
            {data.length > 0 && (
              <HelpContent>
                {data.map(section => (
                  <div
                    key={section.id}
                    dangerouslySetInnerHTML={{
                      __html: sanitize(section.page.body, {
                        allowedTags: sanitize.defaults.allowedTags.concat([
                          'img',
                        ]),
                        allowedAttributes: {
                          img: ['src'],
                        },
                        allowedSchemes: ['data', 'http'],
                      }),
                    }}
                  />
                ))}
              </HelpContent>
            )}
          </ModalDialog>
        )}
      </ModalTransition>
    </>
  );
}

export default Help;
