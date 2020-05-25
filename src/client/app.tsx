import React from "react";
import {Normalize} from "styled-normalize";
import {GlobalStyle} from "./style/global";

import MainPage from "./component/page/MainPage";

const App: React.FunctionComponent = () => {
  return (
    <>
      <Normalize />
      <GlobalStyle />
      <MainPage />
    </>
  );
};

export default App;
