// @flow
import "babel-polyfill";
import "./live-common-setup";
import React from "react";
import { render } from "react-dom";
import App from "./components/App";

const root = document.getElementById("main");
root && render(<App />, root);
