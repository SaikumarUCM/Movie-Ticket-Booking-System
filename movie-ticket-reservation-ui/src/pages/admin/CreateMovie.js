import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import CustomSnackbar from "../home/CustomSnackbar";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "styled-components";

export const genresList = [
  { name: "Action", selected: false },
  { name: "Comedy", selected: false },
  { name: "Thriller", selected: false },
  { name: "Chrime", selected: false },
];

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CreateMovie = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    debugger;
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

  const handleCreateMovie = async () => {
    const { title, genre, director, releaseDate, description, duration, cast } =
      movieData;

    if (
      !title ||
      !genre ||
      !director ||
      !releaseDate ||
      !description ||
      !duration ||
      !cast ||
      !image
    ) {
      setSnackbar({
        message: "All fields are required!",
        alertType: "error",
      });
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append(
      "movieDto",
      JSON.stringify({
        ...movieData,
        releaseDate,
        cast: cast.split(","),
      })
    );

    try {
      await api.post("/movie", formData);
      setSnackbar({
        message: "Movie created successfully!",
        alertType: "success",
      });
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/admin/movies");
      }, 1000);
    } catch (error) {
      setSnackbar({ message: error?.response.data, alertType: "error" });
      setOpenSnackbar(true);
      console.error("Error creating movie:", error);
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
          Create Movie
        </Typography>
        <form>
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
            onClick={handleCreateMovie}
            fullWidth
            style={{ borderRadius: 20, marginTop: 20 }}
          >
            Create Movie
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CreateMovie;
