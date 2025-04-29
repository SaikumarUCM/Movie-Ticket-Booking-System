import React, { useState } from "react";
import {
  Button,
  Container,
  Snackbar,
  Typography,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import UserProfileForm from "./UserProfileForm";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/api";

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [editingFields, setEditingFields] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditingFields({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    const URL = `/customer/${user?.userId}`;

    try {
      const res = await api.put(URL, editingFields);
      const data = res.data;
      updateUser({ ...user, ...data, phoneNumber: data.phone });
      setSnackbarMessage("Update successful.");
      setSnackbarOpen(true);
      setIsEditing(false);
    } catch (error) {
      setSnackbarMessage("Update failed.");
      setSnackbarOpen(true);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditingFields((prevFields) => ({ ...prevFields, [field]: value }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" style={{ color: "white" }}>
          Customer Profile
        </Typography>
        <Paper elevation={3} sx={{ p: 4, my: 4 }}>
          {isEditing ? (
            <UserProfileForm
              editingFields={editingFields}
              onFieldChange={handleFieldChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ my: 2 }}>
                <strong>First Name:</strong> {user.firstName}
              </Typography>
              <Typography variant="subtitle1" sx={{ my: 2 }}>
                <strong>Last Name:</strong> {user.lastName}
              </Typography>
              <Typography variant="subtitle1" sx={{ my: 2 }}>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="subtitle1" sx={{ my: 2 }}>
                <strong>Phone:</strong> {editingFields.phoneNumber}
              </Typography>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
                sx={{ mt: 2 }}
              >
                Edit
              </Button>
            </>
          )}
        </Paper>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default UserProfile;
