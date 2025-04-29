import { Alert, Snackbar } from "@mui/material";

const CustomSnackbar = ({
  open,
  handleClose,
  message,
  alertType = "success",
}) => {
  const validAlertTypes = ["error", "info", "success", "warning"];
  const isValidAlertType = validAlertTypes.includes(alertType);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
    >
      <Alert
        onClose={handleClose}
        severity={isValidAlertType ? alertType : "success"}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
