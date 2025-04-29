import { Link, useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import React from "react";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <Typography variant="h1" gutterBottom>
        Oops!
      </Typography>
      <Typography variant="h3" gutterBottom>
        We can't seem to find the page you're looking for.
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
        Go to Home
      </Button>
      <Button
        onClick={() => navigate(-1)}
        variant="outlined"
        sx={{ mt: 2, ml: 2 }}
      >
        Go Back
      </Button>
    </div>
  );
};

export default PageNotFound;
