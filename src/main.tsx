import React from "react";
import ReactDOM from "react-dom";
import App from "./routes/App";
import ServiceAtHome from "./routes/ServiceAtHome";
import CarCare from "./routes/CarCare";
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
  {
    path: "/car-care",
    element: <CarCare/>,
  }
]);

ReactDOM.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);
