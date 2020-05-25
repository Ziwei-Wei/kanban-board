import React, {FunctionComponent, useRef} from "react";
import styled from "styled-components";

import {Form, Input, Submit} from "../../style/form";

const AuthFormTitle = styled.label`
  min-width: 12rem;
  font-size: 16px;
  padding: 1rem;
  margin: 0.5rem 0rem;
  text-align: center;
  border-bottom: 1px solid whitesmoke;
`;

type ModalProps = {
  title: string;
  onSign: (email: string, password: string) => Promise<void>;
};

const AuthForm: FunctionComponent<ModalProps> = (props: ModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (emailRef.current && passwordRef.current) {
      await props.onSign(emailRef.current.value, passwordRef.current.value);
    }
    formRef.current?.reset();
  };
  return (
    <Form ref={formRef} onSubmit={handleSubmitForm}>
      <AuthFormTitle>{props.title}</AuthFormTitle>
      <label htmlFor={props.title + "email"}>Email</label>
      <Input id={props.title + "email"} type="email" ref={emailRef} />
      <label htmlFor={props.title + "password"}>Password</label>
      <Input id={props.title + "password"} type="password" ref={passwordRef} />
      <Submit type="submit" name="Submit" />
    </Form>
  );
};

export default AuthForm;
