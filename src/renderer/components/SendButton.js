// @flow
import React from "react";
import styled from "styled-components";

const Button = styled.div`
  padding: 0.6em 1.2em;
  font-size: 16px;
  color: ${props =>
    props.disabled ? props.theme.buttonDisabledText : props.theme.buttonText};
  background-color: ${props =>
    props.disabled
      ? props.theme.buttonDisabled
      : props.red
      ? props.theme.buttonRed
      : props.theme.button};
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
`;

type Props = {
  onClick: () => any,
  title: string,
  disabled?: boolean,
  red?: boolean
};

const SendButton = ({ onClick, title, disabled, red }: Props) => (
  <Button
    red={red}
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
  >
    {title}
  </Button>
);

export default SendButton;
