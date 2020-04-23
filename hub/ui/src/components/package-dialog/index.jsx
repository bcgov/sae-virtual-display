import React from 'react';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import { uid } from 'react-uid';

function PackageDialog({ data, name, open, onClose, status }) {
  const actions = [{ text: 'Done', onClick: onClose }];

  return (
    <ModalTransition>
      {open && (
        <ModalDialog
          actions={actions}
          heading={name}
          onClose={onClose}
          width="x-large"
        >
          {status === 'loaded' && (
            <table>
              <thead>
                <tr>
                  {Object.keys(data[0]).map(d => (
                    <th key={d}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(d => (
                  <tr key={uid(d)}>
                    {Object.values(d).map((v, index) => (
                      <td key={uid(v)}>{index < 2 ? <code>{v}</code> : v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ModalDialog>
      )}
    </ModalTransition>
  )
}

export default PackageDialog;
