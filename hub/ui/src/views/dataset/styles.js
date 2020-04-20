import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

export const Container = styled.article`
  padding: 20px 40px;
  background: ${colors.background};
`;

export const Hgroup = styled.hgroup`
  p {
    margin-bottom: 10px;
  }
`;

export const TagsContainer = styled.div`
  & > span {
    margin-right: 2px;
  }
`;

export const Content = styled.div`
  section {
    margin-bottom: 40px;
  }
`;
