import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./apollo/client.js";
import { CreateModalProvider } from "./context/CreateModalContext.jsx";
import "./styles/global.scss";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <CreateModalProvider>
          <App />
        </CreateModalProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);
