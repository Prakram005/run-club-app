import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <SocketProvider>
            <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2800,
              style: {
                background: "rgba(9, 9, 9, 0.94)",
                color: "#ffffff",
                border: "1px solid rgba(255, 77, 77, 0.28)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.35), 0 0 24px rgba(255,26,26,0.12)",
                backdropFilter: "blur(14px)",
                borderRadius: "18px"
              },
              success: {
                iconTheme: {
                  primary: "#ff4d4f",
                  secondary: "#050505"
                }
              },
              error: {
                iconTheme: {
                  primary: "#ff6b6b",
                  secondary: "#050505"
                }
              }
            }}
          />
        </SocketProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
