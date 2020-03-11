import styled, { css, keyframes } from 'styled-components';
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
  color: ${colors.subtleHeading};

  & ${CardActions} {
    opacity: 0;
  }

  ${props =>
    props.error &&
    css`
      color: ${colors.R500};
    `}

  ${props =>
    props.ready &&
    css`
      color: ${colors.green};
      ${elevation.e100()}

      & ${CardActions} {
        opacity: 1;
      }
    `}

  ${props =>
    !props.booting &&
    css`
    & {
      cursor: pointer;
    }

    &:hover {
      ${elevation.e300()}

        & ${CardActions} {
          opacity: 1;
        }
    }`}

  ${props =>
    props.isLoading &&
    css`
      & ${CardActions} {
        opacity: 1;
      }
    `}

`;

export const CardBody = styled.div`
  flex: 1;
  margin: 0.25rem 0;

  & p {
    margin-bottom: 0.5rem;
  }
`;

const loadingAnimation = keyframes`
  from {
    filter: grayscale(1);
  }

  to {
    filter: grayscale(0);
  }
`;

export const CardImg = styled.div`
  margin-right: 1rem;

  ${props =>
    props.isLoading &&
    css`
      animation: ${loadingAnimation} 1s ease-in-out alternate infinite;
    `}

  ${props =>
    !props.isLoading &&
    props.grayscale &&
    css`
      filter: grayscale(1);
    `}
`;

export const CardText = styled.div``;

export const Description = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.text};

  & a {
    padding-left: 0 !important;
  }

  & p {
    margin: 0 10px 0 0;
  }

  & p + a {
    padding-left: 8px;
  }
`;

export const Subtitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  color: inherit;

  & > span {
    margin-left: 10px;
  }

  ${Card}:hover & {
    text-decoration: underline;
  }
`;

export const ProgressContainer = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;

  & > div {
    flex: 1;
  }
`;

// Loading card
export const LoadingCard = styled(Card)`
  height: 84px;
  overflow: hidden;

  &:hover {
    cursor: default;
    box-shadow: none;
    background: #fff;
  }

  & > div:first-child {
    width: 100px;
    height: 100%;
    margin-right: 20px;
    border-radius: ${borderRadius}px;
    background: ${colors.backgroundHover};
  }

  & > div:last-child {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  & div:last-child {
    & > div {
      width: 75%;
      height: 15px;
      margin: 5px 0;
      display: block;
      border-radius: ${borderRadius}px;
      background: ${colors.backgroundHover};
    }

    & > div:first-child {
      width: 24%;
      height: 20px;
    }

    & > div:nth-child(2) {
      width: 45%;
    }
  }
`;
