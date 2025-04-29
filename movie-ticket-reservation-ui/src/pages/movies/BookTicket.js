import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import CustomSnackbar from "../home/CustomSnackbar";
import { useAuth } from "../../contexts/AuthContext";
import PaymentForm from "./PaymentForm";
import { convertTo12HourFormat } from "./constants";

const BookTicket = () => {
  const { theatreId, movieId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState(["A1", "A2", "D2"]);
  const [movieDetails, setMovieDetails] = useState(null);
  const [showTimings, setShowTimings] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const seatsPerRow = 10;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowTiming, setSelectedShowTiming] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [schedule, setSchedule] = useState();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log("user ", user);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const theatresRes = await api.get(`/theatre/${theatreId}`);
        setSelectedTheatre(theatresRes.data);

        const response = await api.get(`/movie/${movieId}`);
        setMovieDetails(response.data);

        const scheduleObj =
          response.data?.scheduleDtos?.find(
            ({ theatreId } = {}) => theatreId === theatresRes?.data?.theatreId
          ) || {};
        setSchedule(scheduleObj);
        setShowTimings(scheduleObj?.showTimings || []);

        const scheduleSeatNumbers = await api.get(
          `/schedule/${scheduleObj.scheduleId}`
        );
        setBookedSeats(scheduleSeatNumbers?.data?.bookedSeatNumbers || []);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  useEffect(() => {
    if (movieDetails && theatreId) {
      const obj =
        movieDetails?.scheduleDtos?.find(
          ({ theatreId } = {}) => theatreId === selectedTheatre?.theatreId
        ) || {};
      setSchedule({ ...obj });
    }
  }, [theatreId, movieDetails]);

  const fetchBookedSeats = async () => {
    try {
      const scheduleSeatNumbers = await api.get(
        `/schedule/${schedule?.scheduleId}/bookings?date=${selectedDate}&time=${selectedShowTiming}`
      );
      setBookedSeats(scheduleSeatNumbers?.data?.bookedSeatNumbers || []);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedShowTiming) fetchBookedSeats();
  }, [selectedDate, selectedShowTiming]);

  useEffect(() => {
    if (selectedShowTiming) {
      const timings = schedule?.showTimings.find(
        (obj) => selectedShowTiming === obj.showTime
      );
      const totalRows =
        timings.totalSeats % seatsPerRow > 0
          ? timings.totalSeats / seatsPerRow + 1
          : timings.totalSeats / seatsPerRow;
      setTotalRows(totalRows);
    }
  }, [selectedShowTiming]);

  useEffect(() => {
    // Calculate the total price based on the number of selected seats and ticket price
    const calculateTotalPrice = () => {
      const totalPrice = selectedSeats.length * schedule?.ticketPrice || 0;
      setTotalPrice(totalPrice);
    };

    calculateTotalPrice();
  }, [selectedSeats, movieDetails]);

  const handleSeatToggle = (row, seatNumber) => {
    const selectedSeat = `${String.fromCharCode(64 + row)}${seatNumber}`;
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(selectedSeat)) {
        return prevSelectedSeats.filter((seat) => seat !== selectedSeat);
      } else {
        return [...prevSelectedSeats, selectedSeat];
      }
    });
  };

  const isSeatSelected = (row, seatNumber) => {
    return selectedSeats.includes(
      `${String.fromCharCode(64 + row)}${seatNumber}`
    );
  };

  const isSeatBooked = (row, seatNumber) => {
    return bookedSeats?.includes(
      `${String.fromCharCode(64 + row)}${seatNumber}`
    );
  };

  const renderSeats = () => {
    const rows = [];

    for (let row = 1; row <= totalRows; row++) {
      const seats = [];
      for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
        const seatId = `${String.fromCharCode(64 + row)}${seatNumber}`;
        const isSelected = isSeatSelected(row, seatNumber);
        const isBooked = isSeatBooked(row, seatNumber);

        seats.push(
          <Grid key={seatId} item>
            <Paper
              onClick={() => handleSeatToggle(row, seatNumber)}
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isBooked ? "not-allowed" : "pointer",
                backgroundColor: isBooked
                  ? "grey.500"
                  : isSelected
                  ? "primary.main"
                  : "grey.200",
                color: isBooked ? "white" : isSelected ? "white" : "black",
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 3,
              }}
            >
              {seatId}
            </Paper>
          </Grid>
        );
      }

      rows.push(
        <Grid
          key={row}
          container
          spacing={2}
          justifyContent="center"
          sx={{ marginBottom: 2 }}
        >
          {seats}
        </Grid>
      );
    }

    return rows;
  };

  const handleBookNow = async ({
    cardNumber,
    cardName,
    expiryMonth,
    expiryYear,
    cvv,
  }) => {
    let message = "";
    if (!selectedDate) {
      message = "Please select a date";
    }
    if (!selectedShowTiming) {
      message = message ? message + ", show time" : "Please select show time";
    }
    if (selectedSeats.length === 0) {
      message = message
        ? message + " and number of seats"
        : "Please select the number of seats";
    }
    if (message) {
      setSnackbar({ message, alertType: "error" });
      setOpenSnackbar(true);
      return;
    }

    const PAID = "Paid";
    const CARD = "Card";

    const paymentDetails = {
      paymentType: CARD,
      totalAmount: totalPrice,
      cardNumber,
      cardName,
      expiryMonth,
      expiryYear,
      cvv,
      status: PAID,
    };

    try {
      // Make an API call to save the booking
      const response = await api.post("/bookings", {
        customerId: user?.userId,
        username: user?.firstName + " " + user?.lastName,
        status: "Success",
        theatreId,
        movieId,
        showDate: selectedDate,
        showTiming: selectedShowTiming,
        seatNumbers: selectedSeats,
        totalAmount: totalPrice,
        scheduleId: schedule?.scheduleId,
        movieId,
        theatreId,
        showTime: selectedShowTiming,
        paymentDetails,
        movieTitle: movieDetails.title,
        theatreName: selectedTheatre?.theatreName,
        location: selectedTheatre?.location,
        genre: movieDetails?.genre,
        cast: movieDetails?.cast?.join(","),
      });

      setSnackbar({
        message: "Ticket booking successful!",
        alertType: "success",
      });
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/customer/bookings");
      }, 1000);

      // Handle the response as needed
      console.log("Booking successful:", response.data);
    } catch (error) {
      console.error("Error booking tickets:", error);
      setSnackbar({ message: error?.response.data, alertType: "error" });
      setOpenSnackbar(true);
    }
  };

  return (
    <Container style={{ color: "white", marginTop: 0 }}>
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

      <Box mt={4}>
        {showPaymentForm ? (
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <Typography variant="h5" gutterBottom>
              <b> {movieDetails.title}</b>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <b>
                {selectedTheatre?.theatreName}
                {selectedDate &&
                  " | " + moment(selectedDate).format("MMM DD, YYYY")}
                {selectedShowTiming && " | " + selectedShowTiming}
              </b>
            </Typography>
            <Typography variant="body1" color={"white"} gutterBottom>
              <b>Selected Seats:</b> {selectedSeats.join(", ")}
            </Typography>
            <br />
            <PaymentForm
              totalPrice={totalPrice}
              handlePayment={handleBookNow}
            />
          </Box>
        ) : (
          <>
            {movieDetails && (
              <>
                <Typography variant="h5" gutterBottom>
                  <b> {movieDetails.title}</b>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Select Date:
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <TextField
                      type="date"
                      variant="outlined"
                      size="small"
                      style={{ color: "transparent" }}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      sx={{
                        marginLeft: 1,
                        borderRadius: 1,
                        position: "relative",
                      }}
                      inputProps={{
                        min: moment(schedule?.startDate).format("YYYY-MM-DD"),
                        max: moment(schedule?.endDate).format("YYYY-MM-DD"),
                        style: { color: "transparent" },
                      }}
                      InputLabelProps={{ shrink: true }}
                      defaultValue={moment(schedule?.startDate).format(
                        "YYYY-MM-DD"
                      )}
                    />
                    {selectedDate && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 12,
                          color: "white",
                        }}
                      >
                        {moment(selectedDate).format("YYYY-MM-DD")}
                      </div>
                    )}
                  </div>
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  Select Show Timing:
                  {showTimings &&
                    showTimings.map(({ showTime }) => (
                      <Button
                        key={showTime}
                        variant={
                          showTime === selectedShowTiming
                            ? "outlined"
                            : "contained"
                        }
                        style={
                          showTime === selectedShowTiming
                            ? { backgroundColor: "white", color: "black" }
                            : {}
                        }
                        onClick={() => setSelectedShowTiming(showTime)}
                        sx={{
                          margin: 1,
                          borderRadius: 8,
                          pointerEvents:
                            showTime === selectedShowTiming ? "none" : "auto",
                          opacity: showTime === selectedShowTiming ? 0.6 : 1,
                        }}
                      >
                        {/* {showTime} */}
                        {moment(showTime, "HH:mm").format("h:mm A")}
                      </Button>
                    ))}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  <b>
                    {selectedTheatre?.theatreName}
                    {selectedDate ? " | " : ""}
                    {selectedDate
                      ? moment(selectedDate).format("MMM DD, YYYY")
                      : ""}
                    {selectedShowTiming ? " | " : ""}
                    {selectedShowTiming
                      ? convertTo12HourFormat(selectedShowTiming)
                      : ""}
                  </b>
                </Typography>
              </>
            )}
            {selectedDate && selectedShowTiming && (
              <Box>
                <Box
                  sx={{
                    backgroundColor: "black",
                    padding: 2,
                    borderRadius: "0 0 20px 20px",
                    textAlign: "center",
                    color: "white",
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="body1">Screen</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  Select Your Seats:
                </Typography>
                <Grid container>{renderSeats()}</Grid>
                <Box mt={2} sx={{ textAlign: "right" }}>
                  <Typography variant="body1" color={"white"} gutterBottom>
                    <b>Selected Seats:</b> {selectedSeats.join(", ")}
                  </Typography>
                  <Typography variant="body1" color={"white"} gutterBottom>
                    <b>Total Price:</b> ${totalPrice.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      let message = "";
                      if (selectedSeats.length === 0) {
                        message = message
                          ? message + " and number of seats"
                          : "Please select the number of seats";
                      }
                      if (message) {
                        setSnackbar({ message, alertType: "error" });
                        setOpenSnackbar(true);
                        return;
                      }

                      setShowPaymentForm(true);
                    }}
                    style={{ marginBottom: 16 }}
                    sx={{
                      marginLeft: "auto",
                      borderRadius: 24,
                      width: "25%",
                      marginTop: 2,
                    }} // Align the button to the right
                  >
                    Book Now
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default BookTicket;
