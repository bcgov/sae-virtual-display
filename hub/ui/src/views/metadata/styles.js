import styled from 'styled-components';

export const Intro = styled.hgroup`
  display: flex;

  aside {
    margin-right: 20px;
  }

  p {
    flex: 1;
  }
`;

export const CardsList = styled.div`
  margin: 40px 0;
  clear: both;
  overflow: hidden;
`;

export const CardContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  background: #fff;
`;

export const CardIcon = styled.div`
  width: 50px;
  margin: 10px;
  display: flex;
  justify-content: center;
`;

export const CardContent = styled.div`
  flex: 1;
  margin: 10px;
`;

export const CardHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CardFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333;
`;
