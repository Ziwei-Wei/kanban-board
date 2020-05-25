import styled from "styled-components";

export const BoardContainer = styled.div`
  height: 20rem;
  min-width: 12rem;
  padding: 0.5rem;
  margin: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0px 0px 10px 1px lightgrey;

  display: flex;
  flex-direction: column;
  justify-items: center;
`;

export const KanBanContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;
`;

export const FullContainer = styled.div`
  margin: 0rem;
  height: 100%;
  width: 100%;
`;

export const PlaceholderContainer = styled.div`
  display: block;
`;
