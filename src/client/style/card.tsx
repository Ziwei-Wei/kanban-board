import styled from "styled-components";

export const Card = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0rem;
`;

export const CardDiv = styled.div`
  user-select: none;
  background-color: white;
  border: 1px solid lightgrey;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  height: min-content;
  padding: 0.5rem;
  box-shadow: 0px 1px 0px lightgrey;

  display: flex;
  flex-direction: column;
  &:active {
    box-shadow: 0px 0px 10px 1px lightgrey;
    border: 1px solid black;
  }
`;

export const CardPlaceholder = styled.div`
  user-select: none;
  background-color: whitesmoke;
  border-radius: 0.5rem;
`;
