import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import AppProviders from "./config/AppProviders";

import "./index.css";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import enGB from "javascript-time-ago/locale/en-GB.json";
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(enGB);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>
);
