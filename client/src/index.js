import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {/* 🌌 MIDNIGHT COSMOS ROOT */}
        <div
          data-theme="night"
          className="min-h-screen bg-gradient-to-br from-[#0b0f1a] via-[#0f172a] to-[#020617] text-base-content"
        >
          <App />
        </div>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
