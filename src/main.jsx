import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import PhoneFrame from "./PhoneFrame.jsx";
import { C } from "./styles/tokens.js";
import "./styles/global.css";
import "./index.css";

// Backdrop around the device set to the app's fill (bone), so the device
// edges melt into the surround for a more expansive, edge-to-edge feel.
const backdrop = C.bone;

// index.css renders the device chrome in the app's native 360pt design space
// (metrics x 360/402); this fill compensates PhoneFrame's 402-based fit math
// so the phone's rendered size in the viewport is unchanged.
const FILL = 0.98 * (402 / 360);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PhoneFrame backdrop={backdrop} fill={FILL}>
      <App />
    </PhoneFrame>
  </React.StrictMode>
);
