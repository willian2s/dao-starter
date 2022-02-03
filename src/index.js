import React from "react";
import ReactDOM from "react-dom";
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";

import App from "./App.jsx";
import "./index.css";

const supportedChainIds = [4];

const connectors = {
  injected: {},
};

ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <App />
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
