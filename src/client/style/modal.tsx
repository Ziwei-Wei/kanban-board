import styled from "styled-components";

export const ModalBackground = styled.div`
  backdrop-filter: blur(4px);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
`;

export const Modal = styled.div`
  min-width: 40rem;
  background: white;
  border: 1px solid black;
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0px 0px 10px 1px lightgrey;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
