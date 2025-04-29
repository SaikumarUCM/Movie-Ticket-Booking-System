import React from "react";
import { TextField, Button, Box } from "@mui/material";

const UserProfileForm = ({
  editingFields,
  onFieldChange,
  onSave,
  onCancel,
}) => {
  const { firstName, lastName, email, phoneNumber } = editingFields;

  return (
    <Box>
      <TextField
        label="First Name"
        variant="outlined"
        value={firstName}
        size="small"
        onChange={(e) => onFieldChange("firstName", e.target.value)}
        sx={{
          marginTop: "10px",
          width: "100%",
        }}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Last Name"
        variant="outlined"
        value={lastName}
        size="small"
        onChange={(e) => onFieldChange("lastName", e.target.value)}
        sx={{
          marginTop: "10px",
          width: "100%",
        }}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        size="small"
        onChange={(e) => onFieldChange("email", e.target.value)}
        sx={{
          marginTop: "10px",
          width: "100%",
        }}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Phone"
        variant="outlined"
        value={phoneNumber}
        size="small"
        onChange={(e) => onFieldChange("phoneNumber", e.target.value)}
        sx={{
          marginTop: "10px",
          width: "100%",
        }}
        InputLabelProps={{ shrink: true }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onSave}
        sx={{ marginTop: "10px", marginRight: "10px" }}
      >
        Save
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={onCancel}
        sx={{ marginTop: "10px" }}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default UserProfileForm;
