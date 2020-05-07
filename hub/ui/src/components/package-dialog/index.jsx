import React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import ChevronLeftIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right-large';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import { uid } from 'react-uid';

import { Title } from './styles';

function PackageDialog({ data, name, open, onClose, onChange, status }) {
  const actions = [{ text: 'Done', onClick: onClose }];
  const onNavClick = dir => () => onChange(dir);
  const Header = () => (
    <Title>
      <h2>{name}</h2>
      <ButtonGroup>
        <Button iconBefore={<ChevronLeftIcon />} onClick={onNavClick(-1)} />
        <Button iconBefore={<ChevronRightIcon />} onClick={onNavClick(1)} />
      </ButtonGroup>
    </Title>
  );

  return (
    <ModalTransition>
      {open && (
        <ModalDialog
          actions={actions}
          components={{ Header }}
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
  );
}

export default PackageDialog;
