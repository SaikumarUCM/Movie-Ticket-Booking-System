import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  Grid,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import CustomSnackbar from "../home/CustomSnackbar";
import { convertTo12HourFormat } from "./constants";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { movieId, theatreId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const { isAuthenticated, isAdmin } = useAuth();
  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await api.get(`/movie/${movieId}`);
        setMovieDetails(response.data);
        const theatresRes = await api.get(`/theatre/${theatreId}`);
        setSelectedTheatre(theatresRes.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleBookTicket = () => {
    if (!isAuthenticated()) {
      setSnackbar({
        message: "You must login first",
        alertType: "error",
      });
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/customer/login");
      }, 1000);
      return;
    }

    // Redirect to the ticket booking page
    navigate(`/theatres/${theatreId}/movies/${movieId}/book-ticket`);
  };

  if (!movieDetails || !selectedTheatre) {
    return <div>Loading...</div>; // You can add a loading spinner or animation here
  }

  const {
    title,
    description,
    imageUrl,
    releaseDate,
    genre,
    scheduleDtos = [],
  } = movieDetails;

  const {
    showTimings = [],
    date,
    ticketPrice,
  } = scheduleDtos.find(
    ({ theatreId } = {}) => theatreId === selectedTheatre?.theatreId
  ) || {};

  return (
    <Container>
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
      <Box mt={2}>
        <Card>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                alt={title}
                height="400" // Decreased the image height
                image={
                  imageUrl
                    ? require(`../../images/${imageUrl}`)
                    : require(`../../images/no_movie_poster.jpeg`)
                } // Replace with the actual image URL
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  Release Date: {releaseDate}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  Genre: {genre}
                </Typography>
                <Typography variant="body1" paragraph>
                  {description}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  Price: ${ticketPrice?.toFixed(2)}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  Show Timings:{" "}
                  {showTimings
                    .map((timing) => {
                      return convertTo12HourFormat(timing.showTime);
                    })
                    ?.map((timing) => timing)
                    ?.join(", ")}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  Date: {date}
                </Typography>
                {!isAdmin() && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBookTicket}
                  >
                    Book Tickets
                  </Button>
                )}
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Container>
  );
};

export default MovieDetails;
