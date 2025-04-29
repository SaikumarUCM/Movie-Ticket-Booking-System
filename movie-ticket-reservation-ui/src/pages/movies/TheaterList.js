import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import api from "../../api/api";

const TheaterList = () => {
  const [theaters, setTheaters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await api.get("/theatre");
        setTheaters(response.data);
      } catch (error) {
        console.error("Error fetching theaters:", error);
      }
    };

    fetchTheaters();
  }, []);

  return (
    <Container style={{ color: "white", marginTop: 16 }}>
      <Typography variant="h4" gutterBottom>
        Theatres List:
      </Typography>
      <Grid container spacing={2}>
        {theaters?.map((theater) => (
          <Grid item key={theater.theatreId}>
            <Card
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 8,
                textAlign: "center",
                minWidth: 300,
                padding: 2,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h5">{theater.theatreName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Location: {theater.location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Contact: {theater.contact}
                </Typography>
                <Button
                  component={Link}
                  to={`/theatres/${theater.theatreId}/movies`}
                  variant="outlined"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  View Movies
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TheaterList;
