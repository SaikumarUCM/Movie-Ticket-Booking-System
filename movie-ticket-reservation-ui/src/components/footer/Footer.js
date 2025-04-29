import React from "react";
import styled from "styled-components";
import { Typography, Link } from "@mui/material";

const StyledFooter = styled.footer`
  background-color: #333;
  color: white;
  padding: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledSection = styled.section`
  flex-basis: 50%;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-basis: 100%;
    flex-direction: column;
  }
`;

const StyledTitle = styled(Typography)`
  && {
    color: white;
    margin-bottom: 10px;
  }
`;

const StyledText = styled(Typography)`
  && {
    color: white;
    margin-bottom: 10px;
  }
`;

const StyledLink = styled(Link)`
  && {
    color: white;
    margin-right: 10px;
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <StyledContainer>
        <StyledSection>
          <StyledTitle variant="h6">Links</StyledTitle>
          <div>
            <StyledLink href="/">Home</StyledLink>
            <StyledLink href="/about-us">About</StyledLink>
            <StyledLink href="/contact-us">Contact Us</StyledLink>
          </div>
        </StyledSection>
        <StyledSection>
          <StyledTitle variant="h6">Contact Us</StyledTitle>
          <StyledText variant="body2">
            123 Main Street
            <br />
            New York, NY 10001
            <br />
            Phone: (555) 555-1234
            <br />
            Email: info@example.com
          </StyledText>
        </StyledSection>
      </StyledContainer>
    </StyledFooter>
  );
};

export default Footer;
