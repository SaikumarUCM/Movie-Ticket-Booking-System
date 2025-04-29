import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Container,
} from "@mui/material";
import { QRCode } from "react-qrcode";
import api from "../../api/api"; // Replace with your actual API module
import { convertTo12HourFormat } from "./constants";

const EticketDetails = () => {
  const { bookingId } = useParams();
  const [eticketDetails, setEticketDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEticketDetails = async () => {
      try {
        // Replace 'your-api-endpoint' with the actual endpoint for fetching e-ticket details
        const response = await api.get(`/eticket/${bookingId}`);
        setEticketDetails(response?.data);
      } catch (error) {
        console.error("Error fetching e-ticket details:", error);
        // Handle error fetching data
      } finally {
        setLoading(false);
      }
    };

    fetchEticketDetails();
  }, [bookingId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!eticketDetails) {
    // Add error handling if needed
    return (
      <Typography variant="h6" style={{ color: "white", marginTop: 24 }}>
        e-ticket details is not found
      </Typography>
    );
  }

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ width: "100%", maxWidth: 500 }}
        spacing={2}
      >
        <Grid item xs={12}>
          <Typography
            variant="h4"
            style={{ color: "white" }}
            align="center"
            gutterBottom
          >
            E-Ticket Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <Typography variant="h6">
              <b> Booking ID:</b> {eticketDetails.bookingId}
            </Typography>
            <Typography variant="body1">
              <b>Customer Name:</b> {eticketDetails.username}
            </Typography>
            <Typography variant="body1">
              <b>Movie:</b> {eticketDetails.title}
            </Typography>
            <Typography variant="body1">
              <b>Cast:</b> {eticketDetails.cast}
            </Typography>
            <Typography variant="body1">
              <b>Genre:</b> {eticketDetails.genre}
            </Typography>
            <Typography variant="body1">
              <b>Theatre:</b> {eticketDetails.theatreName}
            </Typography>
            <Typography variant="body1">
              <b> Location:</b> {eticketDetails.location}
            </Typography>
            <Typography variant="body1">
              <b> Seat Numbers:</b> {eticketDetails.seatNumbers.join(", ")}
            </Typography>
            <Typography variant="body1">
              <b>Show Time:</b> {convertTo12HourFormat(eticketDetails.showTime)}
            </Typography>
            <Typography variant="body1">
              <b> Show Date:</b> {eticketDetails.showDate}
            </Typography>
            <br />
            <QRCode value={bookingId} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.print()}
          >
            Print E-Ticket
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EticketDetails;
