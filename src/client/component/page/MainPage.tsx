import React, {FunctionComponent, useState, useLayoutEffect, useEffect} from "react";
import styled from "styled-components";

import {KanBanContainer} from "../../style/container";
import {FaSignOutAlt} from "react-icons/fa";

import NavBar from "../navigation/navBar";
import KanBan from "../kanban/Kanban";
import AuthForm from "../form/AuthForm";
import {signin, signup, signout, checkJWT} from "../../api";

const AuthContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const HoverButton = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
`;

const KanBanPage: FunctionComponent<{}> = () => {
  const [hasSignedIn, setSignedIn] = useState<boolean>(false);

  const checkStatus = async (): Promise<void> => {
    console.log(localStorage.getItem("token"));
    if (localStorage.getItem("token")) {
      const status = await checkJWT();
      if (status === 200) {
        setSignedIn(true);
      } else {
        localStorage.clear();
      }
    } else {
      setSignedIn(false);
    }
  };

  const signedIn = async (email: string, password: string): Promise<void> => {
    await signin(email, password);
    await checkStatus();
  };

  const signedUp = async (email: string, password: string): Promise<void> => {
    await signup(email, password);
    await checkStatus();
  };

  const signedOut = async (): Promise<void> => {
    await signout();
    await checkStatus();
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <KanBanContainer>
      <NavBar />
      <AuthContainer hidden={hasSignedIn}>
        <AuthForm title={"Signin"} onSign={signedIn} />
        <div>or</div>
        <AuthForm title={"Signup"} onSign={signedUp} />
      </AuthContainer>
      <KanBan hidden={!hasSignedIn} id={"5ecbbc5af0aa073ce0bfa96b"} refresh={hasSignedIn} />
      <HoverButton onClick={signedOut}>
        <FaSignOutAlt />
      </HoverButton>
    </KanBanContainer>
  );
};
export default KanBanPage;
