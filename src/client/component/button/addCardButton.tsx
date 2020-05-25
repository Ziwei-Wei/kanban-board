import React, {FunctionComponent} from "react";
import {FaPlusCircle} from "react-icons/fa";

import {CardButton} from "../../style/button";

type AddCardButtonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const AddCardButton: FunctionComponent<AddCardButtonProps> = (props: AddCardButtonProps) => {
  return (
    <CardButton onClick={props.onClick}>
      <FaPlusCircle />
    </CardButton>
  );
};

export default AddCardButton;
