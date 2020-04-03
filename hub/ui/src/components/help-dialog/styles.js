import styled from 'styled-components';

export const HelpLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HelpContent = styled.div`
  & img {
    width: 100%;
    height: auto;
  }
`;

export const ErrorContainer = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > div {
    text-align: center;
  }
`;
