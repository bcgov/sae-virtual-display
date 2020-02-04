import styled, { css } from 'styled-components';
import { borderRadius, colors, elevation } from '@atlaskit/theme';

export const CardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 5px;
  right: 5px;
  border-radius: ${borderRadius}px;
  transition: opacity 0.25s ease-out;
`;

export const Card = styled.div`
  display: flex;
  padding: 1rem;
  position: relative;
  margin-bottom: 1rem;
  background-color: #fff;
  border-radius: ${borderRadius}px;
  transition: all 0.2s ease-in;
  ${elevation.e200()}

  & ${CardActions} {
    opacity: 0;
  }

  ${props =>
    !props.booting &&
    css`
    & {
      cursor: pointer;
    }

    &:hover {
      ${elevation.e300()}
      background-color: ${colors.backgroundHover};

        & ${CardActions} {
          opacity: 1;
        }
    }`}
`;

export const CardBody = styled.div`
  flex: 1;
  margin: 0.25rem 0;

  & p {
    margin-bottom: 0.5rem;
  }
`;

export const CardIcon = styled.div`
  display: inline-block;
  margin-top: 3px;
  position: relative;
`;

export const CardImg = styled.div`
  margin-right: 1rem;
`;

export const CardText = styled.div`
  & p {
    margin-top: 0;
  }
`;

export const Subtitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  color: ${colors.link};

  ${Card}:hover & {
    text-decoration: underline;
  }
`;

export const ProgressContainer = styled.div`
  flex: 1;
`;
