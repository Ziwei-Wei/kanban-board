import styled from "styled-components";

export const Button = styled.button`
  background-color: transparent;
  border: none;
  padding: 0rem;
  margin-top: 0rem;
  outline: none;
`;

export const CardButton = styled.button`
  background-color: transparent;
  border: 2px dotted lightgrey;
  border-radius: 0.5rem;
  padding: 0.5rem 0rem;
  margin-top: 0.5rem;
  outline: none;
  &:active {
    border: 2px solid black;
  }
`;
