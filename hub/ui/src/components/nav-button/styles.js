import { Link } from 'react-router-dom';
import { extract } from '@src/utils/theme';

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
