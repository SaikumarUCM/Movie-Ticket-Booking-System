import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const PaymentForm = ({ totalPrice, handlePayment }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const formatCardNumber = (value) => {
    // Remove all non-digits
    let cardNumber = value.replace(/\D/g, "");
    // Add a space after every 4 digits
    cardNumber = cardNumber.replace(/(\d{4})/g, "$1 ");
    // Remove any extra spaces
    cardNumber = cardNumber.trim();
    return cardNumber;
  };

  const handleCardNumberChange = (event) => {
    const formattedCardNumber = formatCardNumber(event.target.value);
    setCardNumber(formattedCardNumber);
  };

  const removeSpaces = (value) => {
    return value.replace(/\s/g, "");
  };

  const validateFields = () => {
    const errors = {};
    const cardNumberWithoutSpaces = removeSpaces(cardNumber);
    if (
      cardNumberWithoutSpaces.length !== 12 &&
      cardNumberWithoutSpaces.length !== 16
    ) {
      errors.cardNumber = "Card number must be 12 or 16 digits.";
    }
    if (!/^\d+$/.test(cardNumberWithoutSpaces)) {
      errors.cardNumber = "Card number must contain only numbers.";
    }
    if (!expiryMonth || !expiryYear) {
      errors.expiry = "Expiry date is required.";
    }
    if (!cardName) {
      errors.cardName = "Card name is required.";
    }
    if (!/^\d+$/.test(expiryMonth) || !/^\d+$/.test(expiryYear)) {
      errors.expiry = "Expiry date is required.";
    }

    if (cvv.length !== 3 && cvv.length !== 4) {
      errors.cvv = "CVV must be 3 or 4 digits.";
    }
    if (!/^\d+$/.test(cvv)) {
      errors.cvv = "CVV must contain only numbers.";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const cardNumberWithoutSpaces = removeSpaces(cardNumber);
      const res = await handlePayment({
        cardNumber: cardNumberWithoutSpaces,
        cardName,
        expiryMonth,
        expiryYear,
        cvv,
      });
      if (res === "success") {
        setSubmitted(true);
      } else setSubmitted(false);
    }
  };

  if (submitted) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h5" component="h2">
            Payment successful!
          </Typography>
          <Typography variant="body1">
            You have been charged ${totalPrice}.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%", width: 500 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h5" component="h2">
          Card Details
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Card Number"
            variant="outlined"
            margin="normal"
            size="small"
            fullWidth
            value={cardNumber}
            onChange={handleCardNumberChange}
            error={Boolean(errors.cardNumber)}
            helperText={errors.cardNumber}
          />
          <TextField
            label="Cardholder Name"
            variant="outlined"
            margin="normal"
            size="small"
            fullWidth
            value={cardName}
            error={Boolean(errors.cardName)}
            helperText={errors.cardName}
            onChange={(event) => setCardName(event.target.value)}
          />
          <div style={{ display: "flex" }}>
            <TextField
              label="Expiry Month"
              variant="outlined"
              margin="normal"
              size="small"
              style={{ flex: 1, marginRight: "16px" }}
              value={expiryMonth}
              onChange={(event) => setExpiryMonth(event.target.value)}
              error={Boolean(errors.expiry)}
              helperText={errors.expiry}
            />
            <TextField
              label="Expiry Year"
              variant="outlined"
              margin="normal"
              size="small"
              style={{ flex: 1 }}
              value={expiryYear}
              onChange={(event) => setExpiryYear(event.target.value)}
              error={Boolean(errors.expiry)}
              helperText={errors.expiry}
            />
          </div>
          <TextField
            label="CVV"
            variant="outlined"
            margin="normal"
            size="small"
            fullWidth
            value={cvv}
            onChange={(event) => setCvv(event.target.value)}
            error={Boolean(errors.cvv)}
            helperText={errors.cvv}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, borderRadius: 10 }}
            // style={{ width: "30%" }}
            fullWidth
          >
            Confirm Booking ${totalPrice}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
