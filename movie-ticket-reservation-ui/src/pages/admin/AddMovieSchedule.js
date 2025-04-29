import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import CustomSnackbar from "../home/CustomSnackbar";

const AddMovieSchedule = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [theatreData, setTheatreData] = useState({
    theatreId: "",
    showTimings: [""],
    date: "",
    endDate: "", // Added end date field
    totalSeats: 0,
    ticketPrice: 0.0,
  });
  const [theatreList, setTheatreList] = useState([]);
  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      const defaultSchedule = schedules.find(
        ({ movieId: scheduleMovieId, theatreId: shcheduleTheatreId }) =>
          shcheduleTheatreId === theatreData?.theatreId &&
          scheduleMovieId === movieId
      );
      if (defaultSchedule) {
        setSelectedSchedule(defaultSchedule);
        setTheatreData({
          ...theatreData,
          showTimings: defaultSchedule.showTimings.map(
            (timing) => timing.showTime
          ),
          date: defaultSchedule.date,
          endDate: defaultSchedule.endDate || "", // Added end date
          totalSeats: defaultSchedule?.showTimings[0]?.totalSeats,
          ticketPrice: defaultSchedule.ticketPrice,
        });
      } else {
        setSelectedSchedule(null);
        setTheatreData({
          ...theatreData,
          showTimings: [""],
          date: "",
          endDate: "", // Added end date
          totalSeats: 0,
          ticketPrice: 0.0,
        });
      }
    }
  }, [schedules, theatreData?.theatreId]);

  useEffect(() => {
    const fetchTheatreList = async () => {
      try {
        const response = await api.get("/theatre");
        setTheatreList(response.data);
      } catch (error) {
        console.error("Error fetching theatre list:", error);
      }
    };

    fetchTheatreList();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get(`/movie/${movieId}`);
        setSchedules(response?.data?.scheduleDtos);
      } catch (error) {
        console.error("Failed to fetch schedules", error);
      }
    };

    fetchSchedules();
  }, [movieId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTheatreData({
      ...theatreData,
      [name]: value,
    });
  };

  const handleAddShowTiming = () => {
    if (theatreData.showTimings.some((timing) => timing.trim() === "")) {
      setSnackbar({
        message: "Please fill in all show timings",
        alertType: "error",
      });
      setOpenSnackbar(true);
      return;
    }

    setTheatreData({
      ...theatreData,
      showTimings: [...theatreData.showTimings, ""],
    });
  };

  const handleShowTimingChange = (index, value) => {
    const updatedShowTimings = [...theatreData.showTimings];
    updatedShowTimings[index] = value;
    setTheatreData({
      ...theatreData,
      showTimings: updatedShowTimings,
    });
  };

  const handleDeleteShowTiming = (index) => {
    const updatedShowTimings = [...theatreData.showTimings];
    if (updatedShowTimings.length > 1) {
      updatedShowTimings.splice(index, 1);
      setTheatreData({
        ...theatreData,
        showTimings: updatedShowTimings,
      });
    }
  };

  const handleAddTheatre = async () => {
    const { theatreId, showTimings, date, endDate, totalSeats, ticketPrice } =
      theatreData;

    if (
      !theatreId ||
      showTimings.length === 0 ||
      showTimings.some((timing) => timing.trim() === "") ||
      !date ||
      !endDate ||
      totalSeats <= 0 ||
      ticketPrice <= 0
    ) {
      setSnackbar({
        message: "All fields are required!",
        alertType: "error",
      });
      setOpenSnackbar(true);
      return;
    }

    // Validate "Total Seats" to be a multiple of 10
    if (totalSeats % 10 !== 0) {
      setSnackbar({
        message: "Total Seats must be a multiple of 10",
        alertType: "error",
      });
      setOpenSnackbar(true);
      return;
    }

    // Check for duplicate show times
    const uniqueShowTimings = [...new Set(showTimings)];
    if (uniqueShowTimings.length !== showTimings.length) {
      setSnackbar({
        message: "Duplicate show times are not allowed",
        alertType: "error",
      });
      setOpenSnackbar(true);
      return;
    }

    // Validate start and end dates
    const startDateObject = new Date(date);
    const endDateObject = new Date(endDate);
    if (startDateObject >= endDateObject) {
      setSnackbar({
        message: "End date must be later than the start date",
        alertType: "error",
      });
      setOpenSnackbar(true);
      return;
    }

    const timings = showTimings.map((showTime) => ({
      showTime,
      totalSeats,
      availableSeats: totalSeats,
    }));

    try {
      const payload = {
        theatreId,
        movieId,
        showTimings: timings,
        date,
        startDate: date,
        endDate,
        ticketPrice,
      };
      if (selectedSchedule) {
        await api.put(`/schedule/${selectedSchedule.scheduleId}`, payload);

        setSnackbar({
          message: "Movie Schedule Updated successfully!",
          alertType: "success",
        });
      } else {
        await api.post(`/schedule`, payload);

        setSnackbar({
          message: "Movie Schedule added successfully!",
          alertType: "success",
        });
      }

      setOpenSnackbar(true);
      setTimeout(() => {
        navigate(`/admin/movies/${movieId}/schedule`);
      }, 1000);
    } catch (error) {
      setSnackbar({
        message: error?.response.data,
        alertType: "error",
      });
      setOpenSnackbar(true);
      console.error("Error adding theatre to movie:", error);
    }
  };

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
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Add Theatre to Movie
        </Typography>
        <form>
          <Autocomplete
            options={theatreList}
            getOptionLabel={(option) =>
              `${option.theatreName} - ${option.location}`
            }
            value={
              theatreList.find(
                (theatre) => theatre.theatreId === theatreData.theatreId
              ) || theatreList[0]
            }
            onChange={(_, newValue) => {
              setTheatreData({
                ...theatreData,
                theatreId: newValue?.theatreId || "",
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Theatre"
                variant="outlined"
                fullWidth
                size="small"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <TextField
            label="Start Date"
            type="date"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            name="date"
            value={theatreData.date}
            onChange={handleChange}
          />
          <TextField
            label="End Date"
            type="date"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            name="endDate"
            value={theatreData.endDate}
            onChange={handleChange}
          />
          <TextField
            label="Total Seats (multiple of 10)"
            type="number"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            name="totalSeats"
            value={theatreData.totalSeats}
            onChange={handleChange}
          />
          <TextField
            label="Ticket Price"
            type="number"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            name="ticketPrice"
            value={theatreData.ticketPrice}
            onChange={handleChange}
          />
          {theatreData.showTimings.map((showTiming, index) => (
            <Box key={index} display="flex" alignItems="center">
              <TextField
                key={index}
                label={`Show Timing ${index + 1}`}
                variant="outlined"
                fullWidth
                size="small"
                margin="normal"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={showTiming}
                onChange={(e) => handleShowTimingChange(index, e.target.value)}
              />
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDeleteShowTiming(index)}
                style={{ marginLeft: 12 }}
              >
                Delete
              </Button>
            </Box>
          ))}

          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddShowTiming}
            fullWidth
            style={{ borderRadius: 20, marginTop: 10 }}
          >
            Add Show Timing
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTheatre}
            fullWidth
            style={{ borderRadius: 20, marginTop: 20 }}
          >
            Add Theatre to Movie
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AddMovieSchedule;
