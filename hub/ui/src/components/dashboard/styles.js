import styled from 'styled-components';

import { appBarHeight } from '../shared';

export const Announcement = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 99;
`;

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

  .app-grid {
    margin-top: 20px;

    img {
      margin-bottom: 10px;
    }
  }
`;

const selectedColor = '#38598a';
export const AppOption = styled.div`
  padding: 10px;
  text-align: center;
  position: relative;
  border-radius: 4px;
  border: 2px solid ${props => (props.selected ? selectedColor : '#fff')};

  :hover {
    background-color: #eee;
  }

  p {
    font-weight: bold;
  }
`;

export const CheckedIcon = styled.div`
  top: 0;
  left: 0;
  position: absolute;
`;

export const Header = styled.header`
  padding: 0 0 20px;
  border-bottom: 1px solid #eee;
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;
