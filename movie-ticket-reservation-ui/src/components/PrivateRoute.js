import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const adminUrls = [
  "/admin/dashboard",
  "/admin/customers",
  "/admin/customers/:id",
  "/admin/theatres",
  "/admin/theatres/:id",
  "/admin/theatres/create-new",
  "/admin/theatres/:id/update",
  "/admin/movies",
  "/admin/schedule-movies/:movieId",
  "/admin/movies/create-new",
  "/admin/movies/:id/update",
  "/admin/movies/:movieId/schedule",
  "/admin/movies/:movieId/schedule/create",
  "/admin/customers",
  "/admin/customer/:customerId/bookings",
  "/admin/movies/:movieId/cancel-show",
];

const customerUrls = [
  "/customer/dashboard",
  "/customer/profile",
  "/theatres/:theatreId/movies/:movieId/book-ticket",
  "/customer/bookings",
  "/customer/account-settings",
  "/customer/:customerId/bookings/:bookingId/eticket",
];

function PrivateRoute({ path, element: Component }) {
  const { isAuthenticated, isAdmin, isCustomer } = useAuth();
  let redirectUrl = "/access-denied";
  let hasAccess = false;

  if (adminUrls.includes(path)) {
    hasAccess = isAuthenticated() && isAdmin();
  } else if (customerUrls.includes(path)) {
    hasAccess = isAuthenticated() && isCustomer();
  }

  return <>{hasAccess ? <Component /> : <Navigate to={redirectUrl} />}</>;
}

export default PrivateRoute;
