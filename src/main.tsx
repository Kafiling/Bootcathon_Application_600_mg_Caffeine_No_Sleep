import React from "react";
import ReactDOM from "react-dom";
import App from "./routes/App";
import ServiceAtHome from "./routes/ServiceAtHome";

import BookingService from "./routes/BookingService";
import LocationBooking from "./routes/LocationBooking";

import ServiceAtHomeConfirm from "./routes/ServiceAtHomeConfirm";

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

    path: "/Booking-service",
    element: <BookingService/>,
  },
  {
    path: "/Booking-service/Location-Booking",
    element: <LocationBooking/>,
  },


    path: "/at-home-confirm",
    element: <ServiceAtHomeConfirm/>,
  },

]);

ReactDOM.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);
