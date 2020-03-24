import React from 'react';
import { colors } from '@atlaskit/theme';
import ModalDialog from '@atlaskit/modal-dialog';
import sanitize from 'sanitize-html';
import Spinner from '@atlaskit/spinner';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import { ErrorContainer, HelpContent, HelpLoading } from './styles';

function HelpDialog({ data = [], onClose, request, status }) {
  return (
    <ModalDialog
      actions={[{ onClick: onClose, text: 'Done' }]}
      onOpenComplete={request}
      heading={status !== 'error' && 'BBSAE Help'}
      width="large"
      testId="help-dialog"
    >
      {status === 'error' && (
        <ErrorContainer data-testid="error-message">
          <div>
            <WarningIcon primaryColor={colors.R500} size="xlarge" />
            <h2>Help Content Unavailable</h2>
            <p>
              This content is currently unavailable. Please try again by
              refreshing your browser.
            </p>
          </div>
        </ErrorContainer>
      )}
      {status === 'loading' && (
        <HelpLoading data-testid="loading">
          <Spinner />
        </HelpLoading>
      )}
      {data.length > 0 && (
        <HelpContent data-testid="help-content">
          {data.map(section => (
            <div
              key={section.id}
              dangerouslySetInnerHTML={{
                __html: sanitize(section.page.body, {
                  allowedTags: sanitize.defaults.allowedTags.concat(['img']),
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
  );
}

export default HelpDialog;
