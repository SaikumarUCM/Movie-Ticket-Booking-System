import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const AdminMoviesList = () => {
  const navigate = useNavigate();
  const [moviesList, setMoviesList] = useState([]);

  useEffect(() => {
    const fetchMoviesList = async () => {
      try {
        const response = await api.get("/movie");
        setMoviesList(response.data);
      } catch (error) {
        console.error("Error fetching movies list:", error);
      }
    };

    fetchMoviesList();
  }, []);

  const handleCreateMovie = () => {
    // Redirect to the Create Movie page
    navigate("/admin/movies/create-new");
  };

  const handleEditMovie = (movieId) => {
    // Redirect to the Edit Movie page with the movieId
    navigate(`/admin/movies/${movieId}/update`);
  };

  return (
    <Box p={3}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateMovie}
        style={{ marginBottom: 16, float: "right" }}
      >
        Create Movie
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Title</strong>
              </TableCell>
              <TableCell>
                <strong>Genre</strong>
              </TableCell>
              <TableCell>
                <strong>Director</strong>
              </TableCell>
              <TableCell>
                <strong>Release Date</strong>
              </TableCell>
              <TableCell>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {moviesList.map((movie) => (
              <TableRow key={movie.movieId}>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.genre}</TableCell>
                <TableCell>{movie.director}</TableCell>
                <TableCell>{movie.releaseDate}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditMovie(movie.movieId)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      navigate(`/admin/movies/${movie.movieId}/schedule`);
                    }}
                    style={{ marginLeft: 12 }}
                  >
                    Add Schedule
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      navigate(`/admin/movies/${movie.movieId}/cancel-show`);
                    }}
                    style={{ marginLeft: 12 }}
                  >
                    Cancel shows
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminMoviesList;
