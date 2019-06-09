// @flow
import React from "react";
import styled from "styled-components";

const Button = styled.div`
  padding: 0.6em 1.2em;
  font-size: 16px;
  color: ${props =>
    props.disabled ? props.theme.buttonDisabledText : props.theme.buttonText};
  background-color: ${props =>
    props.secondary
      ? "transparent"
      : props.disabled
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
  secondary?: boolean,
  red?: boolean
};

const SendButton = ({ onClick, title, disabled, secondary, red }: Props) => (
  <Button
    red={red}
    secondary={secondary}
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
  >
    {title}
  </Button>
);

export default SendButton;
