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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const AdminTheatresList = () => {
  const navigate = useNavigate();
  const [theatres, setTheatres] = useState([]);

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const response = await api.get("/theatre");
        setTheatres(response.data);
      } catch (error) {
        console.error("Error fetching theatres:", error);
      }
    };

    fetchTheatres();
  }, []);

  const handleCreateTheatre = () => {
    // Redirect to create theatre page
    navigate("/admin/theatres/create-new");
  };

  const handleEditTheatre = (theatreId) => {
    // Redirect to edit theatre page with theatreId as a parameter
    navigate(`/admin/theatres/${theatreId}/update`);
  };

  return (
    <Box p={3}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateTheatre}
        style={{ marginBottom: 16, float: "right" }}
      >
        Create Theatre
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Location</strong>
              </TableCell>
              <TableCell>
                <strong>Contact</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {theatres.map((theatre) => (
              <TableRow key={theatre.theatreId}>
                <TableCell>{theatre.theatreId}</TableCell>
                <TableCell>{theatre.theatreName}</TableCell>
                <TableCell>{theatre.location}</TableCell>
                <TableCell>{theatre.contact}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditTheatre(theatre.theatreId)}
                  >
                    Edit
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

export default AdminTheatresList;
