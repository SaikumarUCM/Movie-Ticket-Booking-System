import React from "react";
import styled from "styled-components";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StyledBox = styled(Box)`
  padding: 32px;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  background-color: #f1f1f1; /* Light background color */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Subtle shadow */
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const StyledCardContent = styled(CardContent)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Title = styled(Typography)`
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  color: #333; /* Dark text color */
`;

const Description = styled(Typography)`
  text-align: center;
  color: #555; /* Medium text color */
`;

const StyledButton = styled(Button)`
  margin-top: 16px;
  background-color: #3498db; /* Button color */
  color: #fff; /* Button text color */
  &:hover {
    background-color: #217dbb; /* Hover state button color */
  }
`;

const MovieTicketDashboard = () => {
  const navigate = useNavigate();

  const cardData = [
    {
      title: "Book Tickets",
      description: "Book tickets for currently playing movies",
      link: "/movies",
    },
    {
      title: "Manage Bookings",
      description: "View and manage your booked tickets",
      link: "/customer/bookings",
    },
    {
      title: "Account Settings",
      description: "Manage your customer account settings",
      link: "/customer/account-settings",
    },
  ];

  return (
    <StyledBox>
      <Grid container spacing={3}>
        {cardData.map((data, index) => (
          <Grid key={index} item xs={12}>
            <StyledCard onClick={() => navigate(data.link)}>
              <StyledCardContent>
                <Title variant="h5" component="h2">
                  {data.title}
                </Title>
                <Description variant="body2" component="p">
                  {data.description}
                </Description>
              </StyledCardContent>
              <StyledButton size="small" color="primary">
                Explore {data.title}
              </StyledButton>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </StyledBox>
  );
};

export default MovieTicketDashboard;
