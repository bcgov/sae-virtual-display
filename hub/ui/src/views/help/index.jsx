import React, { useContext } from 'react';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import sanitize from 'sanitize-html';
import Spinner from '@atlaskit/spinner';
import useHelp from '@src/hooks/use-help';
import WorkbenchContext from '@src/utils/context';

import { HelpContent, HelpLoading } from './styles';

function Help({ open, onClose }) {
  const { help } = useContext(WorkbenchContext);
  const data = useHelp(help.main);

  return (
    <ModalTransition>
      {open && (
        <ModalDialog
          actions={[{ onClick: onClose, text: 'Done' }]}
          heading="Help"
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
  );
}

export default Help;
