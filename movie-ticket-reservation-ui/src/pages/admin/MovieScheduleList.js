import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import api from "../../api/api";
import CustomSnackbar from "../home/CustomSnackbar";
import { useNavigate, useParams } from "react-router-dom";
import { convertTo12HourFormat } from "../movies/constants";

const MovieScheduleList = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [movie, setMovie] = useState(null);
  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [theatreList, setTheatreList] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get(`/movie/${movieId}`);
        setSchedules(response?.data?.scheduleDtos);
        setMovie(response?.data);

        const theatresRes = await api.get("/theatre");
        setTheatreList(theatresRes.data);
      } catch (error) {
        console.error("Failed to fetch schedules", error);
      }
    };

    fetchSchedules();
  }, [movieId]);

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await api.delete(`/schedule/${scheduleId}`);
      setSnackbar({
        message: "Schedule deleted successfully!",
        alertType: "success",
      });
      setOpenSnackbar(true);

      // After successfully deleting the schedule, you may want to update the state
      // and re-fetch the schedules.
      const updatedSchedules = schedules.filter(
        (schedule) => schedule.scheduleId !== scheduleId
      );
      setSchedules(updatedSchedules);
    } catch (error) {
      setSnackbar({
        message: "Failed to delete schedule",
        alertType: "error",
      });
      setOpenSnackbar(true);
      console.error("Failed to delete schedule", error);
    }
  };

  return (
    <Box style={{ marginTop: 16 }}>
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
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        px={2}
      >
        <Box>
          {movie && (
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
              {movie.title}
            </h2>
          )}
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate(`/admin/movies/${movieId}/schedule/create`);
            }}
          >
            Add / Update Schedule
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Theatre</b>
              </TableCell>
              <TableCell>
                <b>Start Date</b>
              </TableCell>
              <TableCell>
                <b>Start Date</b>
              </TableCell>
              <TableCell>
                <b>Show Timings</b>
              </TableCell>
              <TableCell>
                <b>Price</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {schedules.map((schedule) => {
              let schedulesData = schedule?.showTimings
                ?.map((timing) => convertTo12HourFormat(timing.showTime))
                .join(", ");

              const theatreName = theatreList.find(
                (theatre) => theatre.theatreId === schedule.theatreId
              )?.theatreName;

              return (
                <TableRow key={schedule.scheduleId}>
                  <TableCell>{theatreName}</TableCell>
                  <TableCell>{schedule.startDate || schedule.date}</TableCell>
                  <TableCell>{schedule.endDate}</TableCell>
                  <TableCell>{schedulesData}</TableCell>
                  <TableCell>${schedule.ticketPrice}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleDeleteSchedule(schedule.scheduleId)}
                      style={{ marginLeft: 12 }}
                    >
                      Delete Schedule
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MovieScheduleList;
