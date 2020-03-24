import React, { useContext } from 'react';
import HelpDialog from '@src/components/help-dialog';
import { ModalTransition } from '@atlaskit/modal-dialog';
import useHelp from '@src/hooks/use-help';
import WorkbenchContext from '@src/utils/context';

function Help({ open, onClose }) {
  const { help } = useContext(WorkbenchContext);
  const { data, request, status } = useHelp(help.main);

  return (
    <ModalTransition>
      {open && (
        <HelpDialog
          data={data}
          onClose={onClose}
          request={request}
          status={status}
        />
      )}
    </ModalTransition>
  );
}

export default Help;
