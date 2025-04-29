// CustomerBookings.js

import {
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import CustomSnackbar from "../home/CustomSnackbar";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { convertTo12HourFormat } from "../movies/constants";

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user, isAdmin } = useAuth();
  const { customerId } = useParams();
  const [theatres, setTheatres] = useState([]);
  const navigate = useNavigate();

  const isBeforeShowDateTime = (showDate, showTime) => {
    const showDateTime = new Date(`${showDate} ${showTime}`);
    const currentDateTime = new Date();
    return showDateTime > currentDateTime;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const URL = isAdmin()
        ? `/customer/${customerId}/bookings`
        : `/customer/${user?.userId}/bookings`;
      try {
        const response = await api.get(URL);
        setBookings(response?.data);

        const theatresRes = await api.get("/theatre");
        setTheatres(theatresRes.data);
      } catch (error) {
        console.error("Error fetching customer bookings:", error);
      }
    };

    fetchBookings();
  }, [customerId]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      setSnackbar({
        message: "Booking canceled successfully!",
        alertType: "success",
      });
      setOpenSnackbar(true);
      // Refresh the bookings after canceling
      const URL = isAdmin()
        ? `/customer/${customerId}/bookings`
        : `/customer/${user?.userId}/bookings`;

      const response = await api.get(URL);
      setBookings(response?.data);
    } catch (error) {
      console.error("Error canceling booking:", error);
      setSnackbar({ message: "Error canceling booking", alertType: "error" });
      setOpenSnackbar(true);
    }
  };

  return (
    <Container style={{ color: "white" }}>
      <Typography variant="h4" gutterBottom style={{ marginTop: 12 }}>
        {isAdmin() ? "User Bookings" : "Your Bookings"}
      </Typography>
      {bookings.length === 0 ? (
        <Typography variant="body1">
          {isAdmin()
            ? "User has no bookings at the moment."
            : "You have no bookings at the moment."}
        </Typography>
      ) : (
        bookings.map((booking) => (
          <Card key={booking.bookingId} style={{ marginBottom: "20px" }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <CardMedia
                  component="img"
                  alt={booking?.movie?.title}
                  height="170"
                  image={
                    booking.movie?.imageUrl
                      ? require(`../../images/${booking?.movie?.imageUrl}`)
                      : require(`../../images/no_movie_poster.jpeg`)
                  }
                />
              </Grid>
              <Grid item xs={7}>
                <CardContent>
                  <Typography variant="h6">
                    {booking.movie?.title} -{" "}
                    {
                      theatres?.find(
                        ({ theatreId }) =>
                          booking?.scheduleDto?.theatreId === theatreId
                      )?.theatreName
                    }
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: 4 }}>
                    Date: {booking.showDate}, Time:{" "}
                    {convertTo12HourFormat(booking.showTime)}
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: 4 }}>
                    Seats: {booking.seatNumbers.join(", ")}
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: 4 }}>
                    Total Amount: ${booking.totalAmount.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: 4 }}>
                    Status: {booking.status}
                  </Typography>
                </CardContent>
              </Grid>
              <Grid item xs={3}>
                <CardActions>
                  <Box style={{ display: "flex", flexDirection: "column" }}>
                    {!isAdmin() && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          navigate(
                            `/customer/${user?.userId}/bookings/${booking.bookingId}/eticket`
                          )
                        }
                        style={{ marginTop: 40 }}
                      >
                        View E ticket
                      </Button>
                    )}
                    {isBeforeShowDateTime(booking.showDate, booking.showTime) &&
                      booking.status === "Confirmed" && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleCancelBooking(booking.bookingId)}
                          style={{ marginTop: 10 }}
                        >
                          Cancel Booking
                        </Button>
                      )}
                  </Box>
                </CardActions>
              </Grid>
            </Grid>
          </Card>
        ))
      )}
      <CustomSnackbar
        open={openSnackbar}
        handleClose={() => {
          setSnackbar({
            message: "",
            alertType: "",
          });
          setOpenSnackbar(false);
        }}
        {...snackbar}
      />
    </Container>
  );
};

export default CustomerBookings;
