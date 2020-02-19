import { appBarHeight } from '@src/shared';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #eee;

  & > div {
    width: 800px;
    margin: 40px 0;
  }

  & header {
    display: flex;
    justify-content: flex-end;
  }
`;
