import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

export const Container = styled.article`
  padding: 0 40px 20px;
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

export const Divider = styled.hr`
  width: 100%;
  clear: both;
  margin: 20px 0;
  border: 1px solid ${colors.backgroundHover};
`;

export const ResourcesList = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  & figure {
    flex: 1;
    text-align: center;
  }

  & p {
    font-size: 0.75rem;
  }
`;
