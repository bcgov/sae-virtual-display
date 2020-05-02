import styled from 'styled-components';
import { borderRadius, colors } from '@atlaskit/theme';

export const Container = styled.article`
  padding: 0 40px 20px;
  background: ${colors.background};

  & h4 {
    margin-bottom: 1rem;
  }
`;

export const Hgroup = styled.hgroup`
  p {
    margin-bottom: 10px;
  }
`;

export const InfoList = styled.dl`
  padding: 0;
  margin: 0 0 2rem;
  display: flex;
  flex-wrap: wrap;

  & dd,
  & dt {
    margin: 0 0 0.5rem;
    padding: 0;
  }

  & dt {
    flex: 0 0 20%;
    max-width: 20%;
    font-weight: 600;
  }

  & dd {
    max-width: 80%;
    flex: 0 0 80%;
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
  flex-wrap: wrap;
`;

export const ResourceItemContainer = styled.figure`
  width: 100%;
  flex-grow: 1;
  flex-basis: 0;
  text-align: center;
  margin: 0 0 1rem;
  cursor: pointer;

  & > div {
    padding: 1rem;
    display: inline-block;
    border-radius: ${borderRadius}px;

    &:hover {
      background-color: ${colors.backgroundHover};
    }
  }

  & p {
    font-size: 0.75rem;
  }
`;
