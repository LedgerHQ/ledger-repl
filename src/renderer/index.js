// @flow
import "babel-polyfill";
import "./live-common-setup";
import React from "react";
import { render } from "react-dom";
import { log } from "@ledgerhq/logs";
import App from "./components/App";

window._onLedgerLog = o => log(o.type, o.message);

if (window && window.navigator.usb) {
  window.navigator.usb.addEventListener('connect', console.log.bind(console))
  window.navigator.usb.addEventListener('disconnect', console.log.bind(console))
}

const root = document.getElementById("main");
root && render(<App />, root);
