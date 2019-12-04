import styled from 'styled-components';

import { appBarHeight } from '../shared';

export const Main = styled.main`
  width: 100vw;
  min-height: calc(100vh - ${appBarHeight});
  position: relative;
`;
