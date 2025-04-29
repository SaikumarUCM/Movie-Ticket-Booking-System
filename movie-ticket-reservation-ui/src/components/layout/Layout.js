import React from "react";
import { Box, Container } from "@mui/material";
import Header from "../header/Header";

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <Header />
      <Container maxWidth="lg">
        <main>{children}</main>
      </Container>
    </Box>
  );
};

export default Layout;
