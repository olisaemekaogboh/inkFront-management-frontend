import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTop from "./components/common/ScrollToTop";
import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ScrollToTop />
          <App />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
