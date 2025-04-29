import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Box, Grid, Button, TextField, Autocomplete } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import CustomSnackbar from "../home/CustomSnackbar";

const StyledBox = styled(Box)`
  padding: 32px;
`;

const MovieCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
  background-color: white;
`;

const MovieImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const MovieDetails = styled.div`
  padding: 16px;
`;

const MovieTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0;
`;

const MovieGenre = styled.p`
  color: #555;
  margin: 8px 0;
`;

const ExploreButton = styled(Button)`
  background-color: #3498db;
  color: #fff;

  &:hover {
    background-color: #217dbb;
  }
`;

const MoviesList = () => {
  const { theatreId } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [searchMovie, setSearchMovie] = useState("");
  const [searchTheatre, setSearchTheatre] = useState("");
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState("all");
  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const fetchMovies = async () => {
    try {
      const response = await api.get("/movie");
      setMovies(response.data);
    } catch (error) {
      console.error("Failed to fetch movies", error);
    }
  };

  const fetchTheatres = async () => {
    try {
      const theatresRes = await api.get("/theatre");
      setTheatres(theatresRes.data);
      const theatreIdVal = theatreId
        ? theatreId
        : theatresRes?.data[0]?.theatreId;
      const selectedTheatreObj = theatresRes?.data?.find(
        ({ theatreId }) => theatreIdVal === theatreId
      );
      setSelectedTheatre(selectedTheatreObj);
    } catch (error) {
      console.error("Failed to fetch movies", error);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchTheatres();
  }, []);

  const filteredTheatres = theatres.filter(
    (theatre) =>
      theatre.theatreName.toLowerCase().includes(searchTheatre.toLowerCase()) ||
      theatre.location.toLowerCase().includes(searchTheatre.toLowerCase())
  );

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchMovie) ||
      movie.genre.toLowerCase().includes(searchMovie)
  );

  return (
    <StyledBox>
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
      <Box style={{ display: "flex", color: "white" }}>
        <Box mb={2}>
          <TextField
            label="Search by Movie Name or Genre"
            variant="outlined"
            size="small"
            value={searchMovie}
            onChange={(e) => setSearchMovie(e.target.value)}
          />
        </Box>
        <Box mb={4} style={{ marginLeft: 16, width: "50%" }}>
          <Autocomplete
            options={filteredTheatres}
            getOptionLabel={(option) =>
              `${option.theatreName} - ${option.location}`
            }
            value={selectedTheatre}
            onChange={(_, newValue) => {
              setSelectedTheatre(newValue);
              console.log("new vlaue ", newValue);
              fetchMovies();
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search by Theatre"
                variant="outlined"
                size="small"
                onChange={(e) => setSearchTheatre(e.target.value)}
              />
            )}
            style={{ width: "100%" }}
          />
        </Box>
      </Box>
      <Grid container spacing={3}>
        {filteredMovies
          .filter((movie) => {
            const schedule = movie?.scheduleDtos.find(
              ({ theatreId } = {}) => theatreId === selectedTheatre?.theatreId
            );
            return Boolean(schedule?.theatreId);
          })
          .map((movie) => (
            <Grid key={movie.movieId} item xs={12} md={6} lg={4}>
              <MovieCard
                onClick={() => {
                  if (!selectedTheatre || !selectedTheatre.theatreId) {
                    setSnackbar({
                      message: "Please select the theatre",
                      alertType: "error",
                    });
                    setOpenSnackbar(true);
                    return;
                  } else {
                    navigate(
                      `/theatres/${selectedTheatre?.theatreId}/movies/${movie.movieId}`
                    );
                  }
                }}
              >
                <MovieImage
                  src={
                    movie.imageUrl
                      ? require(`../../images/${movie.imageUrl}`)
                      : require(`../../images/no_movie_poster.jpeg`)
                  }
                  alt={movie.title}
                />
                <MovieDetails>
                  <MovieTitle>{movie.title}</MovieTitle>
                  <MovieGenre>{movie.genre}</MovieGenre>
                  <ExploreButton size="small" color="primary">
                    Explore
                  </ExploreButton>
                </MovieDetails>
              </MovieCard>
            </Grid>
          ))}
      </Grid>
    </StyledBox>
  );
};

export default MoviesList;
