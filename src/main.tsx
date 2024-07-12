import React from "react";
import ReactDOM from "react-dom";
import App from "./routes/App";
import ServiceAtHome from "./routes/ServiceAtHome";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/at-home",
    element: <ServiceAtHome/>,
  },
]);

ReactDOM.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);
