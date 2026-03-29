import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import './index.css';
import {onLCP, onINP, onCLS} from 'web-vitals';

import "./index.css";
import router from "./router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

onCLS(console.log);
onINP(console.log);
onLCP(console.log);