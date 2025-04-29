import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import CustomSnackbar from "../home/CustomSnackbar";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "styled-components";
import { VisuallyHiddenInput, genresList } from "./CreateMovie";

const UpdateMovie = () => {
  const navigate = useNavigate();
  const { id: movieId } = useParams();
  const [movieData, setMovieData] = useState({
    title: "",
    genre: "",
    director: "",
    releaseDate: "",
    description: "",
    duration: 0,
    cast: "", // Added cast field
  });
  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [image, setImage] = useState(null);
  const [genres, setGenresList] = useState(genresList);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await api.get(`/movie/${movieId}`);
        const selectedGenres = response?.data?.genre || [];
        const updatedGenres = genres.map((genre) => ({
          ...genre,
          selected: selectedGenres.includes(genre.name),
        }));
        setGenresList(updatedGenres);

        setMovieData({
          ...response?.data,
          cast: response?.data?.cast?.join(","),
        });
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "genre") {
      const updatedGenres = genres.map((genre) => ({
        ...genre,
        selected: genre.name === value ? !genre.selected : genre.selected,
      }));
      setGenresList([...updatedGenres]);

      setMovieData({
        ...movieData,
        genre: updatedGenres
          .filter((genre) => genre.selected)
          .map((genre) => genre.name)
          .join(","),
      });
    } else {
      setMovieData({
        ...movieData,
        [name]: value,
      });
    }
  };

  const handleUpdateMovie = async () => {
    const { title, genre, director, releaseDate, description, duration, cast } =
      movieData;

    if (
      !title ||
      !genre ||
      !director ||
      !releaseDate ||
      !description ||
      !duration ||
      !cast
    ) {
      setSnackbar({
        message: "All fields are required!",
        alertType: "error",
      });
      setOpenSnackbar(true);
      return;
    }
    const movieObj = { ...movieData };
    delete movieObj["scheduleDto"];

    const formData = new FormData();
    formData.append("image", image);
    formData.append(
      "movieDto",
      JSON.stringify({
        ...movieObj,
        cast: cast.split(","),
      })
    );

    try {
      await api.put(`/movie/${movieId}`, formData);

      setSnackbar({
        message: "Update successful!",
        alertType: "success",
      });
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/admin/movies");
      }, 1000);
    } catch (error) {
      setSnackbar({ message: error?.response.data, alertType: "error" });
      setOpenSnackbar(true);
      console.error("Error updating movie:", error);
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
          Update Movie
        </Typography>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          size="small"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          name="title"
          value={movieData.title}
          onChange={handleChange}
        />
        <FormControl component="fieldset" fullWidth margin="normal">
          <FormLabel component="legend">Genre</FormLabel>
          <FormGroup row>
            {genres.map((genre, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={genre.selected}
                    onChange={handleChange}
                    name="genre"
                    value={genre.name}
                  />
                }
                label={genre.name}
              />
            ))}
          </FormGroup>
        </FormControl>
        <TextField
          label="Director"
          variant="outlined"
          fullWidth
          size="small"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          name="director"
          value={movieData.director}
          onChange={handleChange}
        />
        <TextField
          label="Release Date"
          type="date"
          variant="outlined"
          fullWidth
          size="small"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          name="releaseDate"
          value={movieData.releaseDate}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          size="small"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          multiline
          rows={4}
          name="description"
          value={movieData.description}
          onChange={handleChange}
        />
        <TextField
          label="Duration (minutes)"
          type="number"
          variant="outlined"
          fullWidth
          size="small"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          name="duration"
          value={movieData.duration}
          onChange={handleChange}
        />
        <TextField
          label="Cast"
          variant="outlined"
          fullWidth
          size="small"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          name="cast"
          value={movieData.cast}
          onChange={handleChange}
        />
        <Box mt={2} sx={{ display: "flex", alignSelf: "flex-start" }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            {image?.name
              ? image.name.length > 30
                ? `${image.name.slice(0, 30)}...`
                : image.name
              : "Upload movie poster"}

            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateMovie}
          fullWidth
          style={{ borderRadius: 20, marginTop: 10 }}
        >
          Update Movie
        </Button>
      </Box>
    </Container>
  );
};

export default UpdateMovie;
