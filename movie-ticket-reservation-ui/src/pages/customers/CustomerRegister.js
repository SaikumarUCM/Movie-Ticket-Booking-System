import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/api";
import CustomSnackbar from "../home/CustomSnackbar";

const StyledLink = ({ children, ...props }) => (
  <Link style={{ textDecoration: "none", color: "inherit" }} {...props}>
    {children}
  </Link>
);

const CustomerRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [snackbar, setSnackbar] = useState({
    message: "",
    alertType: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [successMessage]);

  const handleRegister = async () => {
    try {
      // Basic validation
      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !confirmPassword ||
        !phone
      ) {
        setSnackbar({
          message: "All fields are required!",
          alertType: "error",
        });
        setOpenSnackbar(true);
        return;
      }

      if (password !== confirmPassword) {
        setSnackbar({
          message: "Passwords do not match",
          alertType: "error",
        });
        setOpenSnackbar(true);
        return;
      }

      await api.post("/customer", {
        firstName,
        lastName,
        email,
        password,
        phoneNumber: phone,
      });

      setSnackbar({
        message: "Registration successful! Please login to your account",
        alertType: "success",
      });
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/customer/login");
      }, 1000);
    } catch (err) {
      setSnackbar({ message: err?.response.data, alertType: "error" });
      setOpenSnackbar(true);
      console.error(err);
      return "fail";
    }
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
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
          maxWidth: "400px",
          gap: "16px",
          marginTop: 40,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Customer Registration
        </Typography>
        <TextField
          label="First Name"
          variant="outlined"
          size="small"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          size="small"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Email"
          variant="outlined"
          size="small"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          size="small"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          size="small"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Phone"
          variant="outlined"
          size="small"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          fullWidth
          style={{ borderRadius: 20, marginTop: 10 }}
        >
          Register
        </Button>
        <Typography variant="body1">
          Already have an account?{" "}
          <StyledLink to="/customer/login">Login here</StyledLink>
        </Typography>
      </Box>
    </Container>
  );
};

export default CustomerRegister;
