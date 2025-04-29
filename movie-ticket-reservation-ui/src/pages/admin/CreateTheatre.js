import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import CustomSnackbar from "../home/CustomSnackbar";

const CreateTheatre = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    setTheatreData({
      ...theatreData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTheatre = async () => {
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
      await api.post("/theatre", theatreData);
      setSnackbar({
        message: "Theatre created successfully!",
        alertType: "success",
      });
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/admin/theatres");
      }, 1000);
    } catch (error) {
      setSnackbar({ message: error?.response.data, alertType: "error" });
      setOpenSnackbar(true);
      console.error("Error creating theatre:", error);
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
          Create Theatre
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
            type="number"
            name="contact"
            value={theatreData.contact}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateTheatre}
            fullWidth
            style={{ borderRadius: 20, marginTop: 10 }}
          >
            Create Theatre
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CreateTheatre;
