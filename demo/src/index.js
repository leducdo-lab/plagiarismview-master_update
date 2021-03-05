// @flow

import React from "react";
import { render } from "react-dom";
import App from "./App";
import 'font-awesome/css/font-awesome.min.css';
import 'w3-css/w3.css';
import "./style/style.css";
import "./style/bootstrap.min.css";

const demoNode = document.querySelector("#demo");

if (demoNode) {
  render(<App />, demoNode);
}

