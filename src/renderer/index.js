// @flow
import "babel-polyfill";
import "./live-common-setup";
import React from "react";
import { render } from "react-dom";
import { log } from "@ledgerhq/logs";
import App from "./components/App";

window._onLedgerLog = o => log(o.type, o.message);

const root = document.getElementById("main");
root && render(<App />, root);
