import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const AdminCustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/customer");
        setCustomers(response.data);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleViewBookings = (customerId) => {
    navigate(`/admin/customer/${customerId}/bookings`);
  };

  const handleBackToCustomersList = () => {
    setSelectedCustomerId(null);
  };

  return (
    <Box style={{ marginTop: 16 }}>
      <Typography variant="h5" gutterBottom style={{ color: "white" }}>
        Customers List
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Customer ID</b>
              </TableCell>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.customerId}>
                <TableCell>{customer.customerId}</TableCell>
                <TableCell>
                  {customer.firstName} {customer.lastName}
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewBookings(customer.customerId)}
                  >
                    View Bookings
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

export default AdminCustomersList;
