import React, {FunctionComponent} from "react";
import {NavContainer, NavHeader} from "../../style/header";

import {FaBook} from "react-icons/fa";

const NavBar: FunctionComponent<{}> = () => {
  return (
    <NavContainer>
      <NavHeader>
        <FaBook />
        <div>KanBan</div>
        <div></div>
      </NavHeader>
    </NavContainer>
  );
};

export default NavBar;
