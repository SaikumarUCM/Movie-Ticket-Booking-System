import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import moment from "moment";
import "moment-timezone";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import AddMovieSchedule from "./pages/admin/AddMovieSchedule";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminMoviesList from "./pages/admin/AdminMoviesList";
import AdminTheatresList from "./pages/admin/AdminTheatresList";
import CreateMovie from "./pages/admin/CreateMovie";
import CreateTheatre from "./pages/admin/CreateTheatre";
import UpdateMovie from "./pages/admin/UpdateMovie";
import UpdateTheatre from "./pages/admin/UpdateTheatre";
import CustomerDashboard from "./pages/customers/CustomerDashboard";
import CustomerLogin from "./pages/customers/CustomerLogin";
import CustomerRegister from "./pages/customers/CustomerRegister";
import PageNotFound from "./pages/home/NotFound";
import Logout from "./pages/login/Logout";
import BookTicket from "./pages/movies/BookTicket";
import MovieDetails from "./pages/movies/MovieDetails";
import MoviesList from "./pages/movies/MoviesList";
import TheaterList from "./pages/movies/TheaterList";
import UserProfile from "./pages/users/UserProfile";
import MovieScheduleList from "./pages/admin/MovieScheduleList";
import AdminCustomersList from "./pages/admin/AdminCustomersList";
import CustomerBookings from "./pages/customers/CustomerBookings";
import AdminMovieDetails from "./pages/admin/AdminMovieDetails";
import EticketDetails from "./pages/movies/EticketDetails";

moment.tz.setDefault("UTC");

const theme = createTheme({
  palette: {
    primary: {
      main: "#DC143C",
    },
    secondary: {
      main: "#D51F1F",
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <ThemeProvider
          theme={theme}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <CssBaseline />
          <Router>
            <Layout style={{ flex: 1 }}>
              <Routes>
                <Route exact path="/" element={<MoviesList />} />
                <Route exact path="/logout" element={<Logout />} />
                <Route
                  exact
                  path="/customer/login"
                  element={<CustomerLogin />}
                />
                <Route
                  exact
                  path="/customer/register"
                  element={<CustomerRegister />}
                />
                <Route
                  exact
                  path="/customer/dashboard"
                  element={
                    <PrivateRoute
                      path="/customer/dashboard"
                      element={CustomerDashboard}
                    />
                  }
                />
                <Route
                  exact
                  path="/customer/bookings"
                  element={
                    <PrivateRoute
                      path="/customer/bookings"
                      element={CustomerBookings}
                    />
                  }
                />
                <Route
                  exact
                  path="/customer/:customerId/bookings/:bookingId/eticket"
                  element={
                    <PrivateRoute
                      path="/customer/:customerId/bookings/:bookingId/eticket"
                      element={EticketDetails}
                    />
                  }
                />
                <Route
                  exact
                  path="/customer/account-settings"
                  element={
                    <PrivateRoute
                      path="/customer/account-settings"
                      element={UserProfile}
                    />
                  }
                />
                <Route exact path="/movies" element={<MoviesList />} />
                <Route
                  exact
                  path="/movies/:movieId"
                  element={<MovieDetails />}
                />
                <Route exact path="/theatres" element={<TheaterList />} />
                <Route
                  exact
                  path="/theatres/:theatreId/movies"
                  element={<MoviesList />}
                />
                <Route
                  exact
                  path="/theatres/:theatreId/movies/:movieId/"
                  element={<MovieDetails />}
                />
                <Route
                  exact
                  path="/theatres/:theatreId/movies/:movieId/book-ticket"
                  element={
                    <PrivateRoute
                      path="/theatres/:theatreId/movies/:movieId/book-ticket"
                      element={BookTicket}
                    />
                  }
                />
                <Route exact path="/admin/login" element={<AdminLogin />} />
                <Route
                  exact
                  path="/admin/dashboard"
                  element={
                    <PrivateRoute
                      path="/admin/dashboard"
                      element={AdminDashboard}
                    />
                  }
                />
                <Route
                  exact
                  path="/admin/customer/:customerId/bookings"
                  element={
                    <PrivateRoute
                      path="/admin/customer/:customerId/bookings"
                      element={CustomerBookings}
                    />
                  }
                />

                <Route
                  exact
                  path="/admin/theatres"
                  element={
                    <PrivateRoute
                      path="/admin/theatres"
                      element={AdminTheatresList}
                    />
                  }
                />
                <Route
                  exact
                  path="/admin/theatres/create-new"
                  element={
                    <PrivateRoute
                      path="/admin/theatres/create-new"
                      element={CreateTheatre}
                    />
                  }
                />
                <Route
                  exact
                  path="/admin/theatres/:id/update"
                  element={
                    <PrivateRoute
                      path="/admin/theatres/:id/update"
                      element={UpdateTheatre}
                    />
                  }
                />
                <Route
                  exact
                  path="/admin/movies"
                  element={
                    <PrivateRoute
                      path="/admin/movies"
                      element={AdminMoviesList}
                    />
                  }
                />

                <Route
                  exact
                  path="/admin/movies/create-new"
                  element={
                    <PrivateRoute
                      path="/admin/movies/create-new"
                      element={CreateMovie}
                    />
                  }
                />
                <Route
                  exact
                  path="/admin/movies/:id/update"
                  element={
                    <PrivateRoute
                      path="/admin/movies/:id/update"
                      element={UpdateMovie}
                    />
                  }
                />
                <Route
                  exact
                  path="/admin/movies/:movieId/cancel-show"
                  element={
                    <PrivateRoute
                      path="/admin/movies/:movieId/cancel-show"
                      element={AdminMovieDetails}
                    />
                  }
                />
                <Route
                  exact
                  path="/admin/movies/:movieId/schedule"
                  element={
                    <PrivateRoute
                      path="/admin/movies/:movieId/schedule"
                      element={MovieScheduleList}
                    />
                  }
                />
                <Route
                  exact
                  path="/admin/movies/:movieId/schedule/create"
                  element={
                    <PrivateRoute
                      path="/admin/movies/:movieId/schedule/create"
                      element={AddMovieSchedule}
                    />
                  }
                />

                <Route
                  exact
                  path="/admin/customers"
                  element={
                    <PrivateRoute
                      path="/admin/customers"
                      element={AdminCustomersList}
                    />
                  }
                />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </div>
    </AuthProvider>
  );
}

export default App;
