import styled from "styled-components";

export const CardHeader = styled.div`
  padding: 0.25rem;
  margin: 0.25rem 0rem;
  background-color: white;
  border-bottom: 1px solid lightgrey;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalHeader = styled.div`
  height: 1rem;
  padding: 0.5rem;
  background-color: white;
  border-bottom: 1px solid lightgrey;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalFooter = styled.div`
  height: 1rem;
  padding: 0.5rem;
  background-color: white;
  border-top: 1px solid lightgrey;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NavContainer = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0px 0px 10px 1px lightgrey;
`;

export const NavHeader = styled.div`
  margin: 0rem 1rem;
  height: 3rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;
