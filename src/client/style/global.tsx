import {createGlobalStyle} from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    font-size: 12px;
  }
  html {
    width: 100vw;
    height: 100vh;
  }
  body {
    width: 100%;
    height: 100%;
  }
  #root{
    width: 100%;
    height: 100%;
  }
`;
