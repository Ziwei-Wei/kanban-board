import styled from "styled-components";

export const Form = styled.form`
  padding: 1rem 1rem;
  margin: 1rem;

  display: flex;
  flex-direction: column;
`;

export const Select = styled.select`
  background: white;
  margin: 0.25rem 0rem;
  border: 1px solid lightgrey;
  border-radius: 3px;
  ::placeholder {
    color: palevioletred;
  }
  outline: none;
`;

export const Input = styled.input`
  background: white;
  margin: 0.25rem 0rem;
  border: 1px solid lightgrey;
  border-radius: 3px;
  ::placeholder {
    color: palevioletred;
  }
  outline: none;
`;

export const UploadLabel = styled.label`
  margin: 0.25rem 0rem;
  border: 1px solid black;
  border-radius: 5px;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
`;

export const UploadInput = styled.input`
  display: none;
`;

export const Submit = styled.input`
  margin: 0.25rem 0rem;
  width: 100%;
  border-radius: 5px;
  height: 35px;
  border-color: transparent;
  background: black;
  color: white;
  margin-bottom: 0;
  box-shadow: 0px;
  text-align: center;
  cursor: pointer;
  outline: none;
`;
