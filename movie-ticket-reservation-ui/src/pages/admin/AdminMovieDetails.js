import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  Select,
  MenuItem,
  Grid,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import CustomSnackbar from "../home/CustomSnackbar";
import DatePicker from "@mui/lab/DatePicker";
import moment from "moment";
import { convertTo12HourFormat } from "../movies/constants";

const StyledBox = styled(Box)`
  padding: 32px;
`;

const MovieDetails = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatreId, setSelectedTheatreId] = useState("");
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTimings, setShowTimings] = useState([]);
  const [schedule, setSchedule] = useState();
  const [selectedShowTiming, setSelectedShowTiming] = useState(null);
  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const fetchMovieDetails = async () => {
    try {
      const theatresRes = await api.get("/theatre");
      setSelectedTheatre(theatresRes?.data[0]);
      setSelectedTheatreId(theatresRes?.data[0]?.theatreId);
      setTheatres(theatresRes.data);

      const response = await api.get(`/movie/${movieId}`);
      setMovieDetails(response.data);

      const scheduleObj =
        response.data?.scheduleDtos?.find(
          ({ theatreId } = {}) =>
            theatreId === theatresRes?.data?.[0]?.theatreId
        ) || {};
      setSchedule(scheduleObj);
      setShowTimings(scheduleObj?.showTimings || []);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  const handleCancelShow = async () => {
    let message = "";
    if (!selectedTheatreId) {
      message = "Please select theatre";
    }
    if (!selectedDate) {
      message = "Please select a date";
    }
    if (!selectedShowTiming) {
      message = message ? message + ", show time" : "Please select show time";
    }

    if (message) {
      setSnackbar({ message, alertType: "error" });
      setOpenSnackbar(true);
      return;
    }

    try {
      // Make an API call to cancel all bookings for the selected show
      await api.put(`/schedule/${schedule?.scheduleId}/cancel-show`, {
        showDate: selectedDate,
        showTime: selectedShowTiming,
      });
      setSnackbar({
        message: "Show canceled successfully!",
        alertType: "success",
      });
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error canceling show:", error);
      setSnackbar({
        message: "Error canceling show",
        alertType: "error",
      });
      setOpenSnackbar(true);
    }
  };

  const handleTheatreChange = (_, value) => {
    setSelectedTheatre(value);
    setSelectedTheatreId(value?.theatreId);
    const scheduleObj =
      movieDetails?.scheduleDtos?.find(
        ({ theatreId } = {}) => theatreId === value?.theatreId
      ) || {};
    setSchedule(scheduleObj);
    setShowTimings(scheduleObj?.showTimings || []);
  };

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
      <StyledBox mt={2}>
        <Card>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                alt={movieDetails?.title}
                height="400"
                image={
                  movieDetails?.imageUrl
                    ? require(`../../images/${movieDetails?.imageUrl}`)
                    : require(`../../images/no_movie_poster.jpeg`)
                }
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {movieDetails?.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  Select Theatre:
                  <Autocomplete
                    options={theatres}
                    getOptionLabel={(option) =>
                      `${option.theatreName} - ${option.location}`
                    }
                    value={selectedTheatre}
                    onChange={handleTheatreChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    )}
                  />
                </Typography>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  style={{ marginTop: 16 }}
                >
                  Select Date:
                  <TextField
                    type="date"
                    variant="outlined"
                    size="small"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    sx={{ marginLeft: 1, borderRadius: 1 }}
                    inputProps={{
                      min: moment(movieDetails?.releaseDate).format(
                        "YYYY-MM-DD"
                      ),
                      max: moment().add(365, "days").format("YYYY-MM-DD"),
                    }}
                  />
                </Typography>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  style={{ marginTop: 16 }}
                >
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
                        {convertTo12HourFormat(showTime)}
                      </Button>
                    ))}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancelShow}
                  style={{ marginTop: "10px" }}
                  disabled={showTimings?.length === 0}
                >
                  Cancel Entire Show
                </Button>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </StyledBox>
    </Container>
  );
};

export default MovieDetails;
