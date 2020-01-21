import { appBarHeight } from '@src/shared';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { extract } from '../../utils/theme';

const navButtonTheme = {
  default: {
    background: {
      default: 'rgba(255, 255, 255, 0)',
      hover: 'rgba(255, 255, 255, 0.2)',
      selected: 'rgba(255, 255, 255, 0.1)',
    },
    color: {
      default: '#fff',
      hover: '#fff',
      active: '#fff',
      selected: '#fff',
    },
  },
};

export const buttonTheme = (currentTheme, themeProps) => {
  const { buttonStyles, ...rest } = currentTheme(themeProps);

  return {
    buttonStyles: {
      ...buttonStyles,
      ...extract(navButtonTheme, themeProps),
    },
    ...rest,
  };
};

export const Container = styled.nav`
  width: 100vw;
  height: ${appBarHeight};
  padding: 8px 20px;
  position: sticky;
  top: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #003366;
  color: white;
  z-index: 9;

  ul {
    list-style: none;
  }

  li {
    display: inline-block;
  }

  & > div {
    display: flex;
    align-items: center;
  }

  p {
    margin: 0 20px 0 0;
  }
`;

export const Icon = styled.div`
  display: inline-block;
  margin-right: 10px;
`;

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-size: 24px;
  line-height: 1.5;
  color: inherit;

  :hover {
    text-decoration: none;
  }
`;

export const Nav = styled.div`
  padding: 0;
  margin: 0 0 0 30px;
`;
