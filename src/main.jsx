import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App, routeLocale } from "./App.jsx";
import "./site.css";

const root = document.getElementById("root");
// 404.html is prerendered in Portuguese and GitHub Pages serves it for every unknown address. Under /en/ the app renders
// the English 404, so the Portuguese markup is dropped and rendered fresh instead of hydrated against other content.
const prerenderedLocale = document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "pt";
if (root.hasChildNodes() && routeLocale(window.location.pathname) !== prerenderedLocale) root.replaceChildren();
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
