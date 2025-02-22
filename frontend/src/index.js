import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./context/ChatProvider";
import { BrowserRouter } from "react-router-dom";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <ChatProvider>
          <App />
        </ChatProvider>
      </BrowserRouter>
    </ChakraProvider>
  );

