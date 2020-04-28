import Button from '@atlaskit/button';
import styled from 'styled-components';
import { borderRadius, colors } from '@atlaskit/theme';

export const Container = styled.div`
  margin: 20px 40px;
`;

export const EmptyText = styled.div`
  padding: 1rem;
  text-align: center;
  background-color: ${colors.background};

  & em {
    color: ${colors.textActive};
  }
`;

export const Form = styled.form`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

export const FormIcon = styled.span`
  width: 30px;
  margin-left: 5px;
  display: flex;
  align-items: center;
`;

export const SubmitButton = styled(Button)`
  height: 40px !important;
  margin-left: 20px;
`;

export const ResultsList = styled.ol`
  padding-left: 30px;
  list-style: none;
  counter-reset: search-counter;
`;

export const ResultItem = styled.li`
  margin: 0;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${colors.backgroundHover};
  position: relative;
  color: ${colors.text};
  counter-increment: search-counter;

  &:before {
    position: absolute;
    left: -20px;
    content: counter(search-counter);
    color: ${colors.N60};
  }

  & header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const ResourcesList = styled.div`
  margin-top: 20px;

  & > div {
    margin-bottom: 2px;
    padding: 2px 5px;
    display: flex;
    align-items: center;
    background-color: ${colors.backgroundHover};
    border-radius: ${borderRadius}px;

    & > *:first-child {
      margin-right: 10px;
    }
  }
`;

export const LoadingContainer = styled.div`
  margin: 30px 0 30px 20px;
`;

export const LoadingBar = styled.div`
  width: ${props => props.width || '100%'};
  height: 20px;
  margin: 0 0 0.5rem;
  background-color: ${colors.backgroundHover};
  border-radius: ${borderRadius}px;
`;
