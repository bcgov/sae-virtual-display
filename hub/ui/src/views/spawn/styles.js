import { appBarHeight } from '@src/shared';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: calc(100vh - ${appBarHeight});
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee;

  & > div {
    width: 600px;
  }
`;

export const Card = styled.div`
  padding: 20px;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
`;
