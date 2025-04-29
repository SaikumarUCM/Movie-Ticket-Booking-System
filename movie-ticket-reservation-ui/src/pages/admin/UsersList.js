import { Delete } from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../../api/api";

const StyledContainer = styled(Container)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledTableContainer = styled(TableContainer)`
  max-height: 400px;
`;

const StyledIconButton = styled(IconButton)`
  color: red;
`;

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter((user) => user.userId !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding="32px"
            bgcolor="#fff"
            borderRadius="8px"
            boxShadow="0 3px 10px rgba(0, 0, 0, 0.2)"
            maxWidth="800px"
            width="100%"
            margin="0 20px"
          >
            <Typography variant="h5" component="h1" gutterBottom>
              List of Users
            </Typography>
            <StyledTableContainer component={Paper}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>ID</b>
                    </TableCell>
                    <TableCell>
                      <b>Name</b>
                    </TableCell>
                    <TableCell>
                      <b>Email</b>
                    </TableCell>
                    <TableCell>
                      <b>Role</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Actions</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell component="th" scope="row">
                        {user.userId}
                      </TableCell>
                      <TableCell>
                        {user.firstName + " " + user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell align="right">
                        <StyledIconButton
                          onClick={() => handleDeleteUser(user.userId)}
                        >
                          <Delete />
                        </StyledIconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Box>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default UsersList;
