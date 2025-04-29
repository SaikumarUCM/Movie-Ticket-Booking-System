import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import CustomSnackbar from "../home/CustomSnackbar";

const UpdateTheatre = () => {
  const navigate = useNavigate();
  const { id: theatreId } = useParams();
  const [theatreData, setTheatreData] = useState({
    theatreName: "",
    location: "",
    contact: "",
  });
  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchTheatreDetails = async () => {
      try {
        const response = await api.get(`/theatre/${theatreId}`);
        setTheatreData(response.data);
      } catch (error) {
        console.error("Error fetching theatre details:", error);
      }
    };

    fetchTheatreDetails();
  }, [theatreId]);

  const handleChange = (e) => {
    setTheatreData({
      ...theatreData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateTheatre = async () => {
    const { theatreName, location, contact } = theatreData;

    if (!theatreName || !location || !contact) {
      setSnackbar({
        message: "All fields are required!",
        alertType: "error",
      });
      setOpenSnackbar(true);
      return;
    }

    try {
      await api.put(`/theatre/${theatreId}`, theatreData);
      setSnackbar({
        message: "Theatre updated successfully!",
        alertType: "success",
      });
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/admin/theatres");
      }, 1000);
    } catch (error) {
      setSnackbar({ message: error?.response.data, alertType: "error" });
      setOpenSnackbar(true);
      console.error("Error updating theatre:", error);
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
          gap: "16px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Update Theatre
        </Typography>
        <form>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            name="theatreName"
            value={theatreData.theatreName}
            onChange={handleChange}
          />
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            name="location"
            value={theatreData.location}
            onChange={handleChange}
          />
          <TextField
            label="Contact"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            name="contact"
            value={theatreData.contact}
            onChange={handleChange}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={handleUpdateTheatre}
            fullWidth
            style={{ borderRadius: 20, marginTop: 10 }}
          >
            Update Theatre
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default UpdateTheatre;
