import React from "react";
import { Link } from "react-router-dom";
import BackgroundImage from "../Assets/imgs/16623.jpg"; // Import background image for the landing page
import { Box, Typography, Container, Button } from "@mui/material"; // Import Material-UI components
import "@fontsource/roboto/300.css"; // Import Roboto font weights for typography
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// The LandingPage component is the first page that users see when they visit the application.
const LandingPage = () => {
  return (
    // Container with a background image that covers the entire viewport
    <Container
      maxWidth={false}
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        width: "100vw",
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        textAlign: "center",
      }}
    >
      {/* Box used as a wrapper for the title and subtitle to control their width and margin */}
      <Box style={{ width: "50%", margin: "auto" }}>
        {/* Main title of the landing page */}
        <Typography
          variant="h2"
          component="h2"
          style={{ color: "#FEFDED", marginBottom: "5%", paddingTop: "12%" }}
          sx={{ fontWeight: "bold" }}
        >
          Blockchain-based Land Registry
        </Typography>
        {/* Subtitle with a brief description of the service */}
        <Typography
          variant="h5"
          component="h5"
          style={{ marginBottom: "10%", color: "#FEFDED" }}
          sx={{ fontWeight: "medium", fontStyle: "italic" }}
        >
          Securing Your Ground, Block by Block - Immutable Land Registration at
          Your Fingertips!
        </Typography>
      </Box>

      {/* Box that serves as a card for role selection with styling for visibility */}
      <Box
        height={200}
        width={200}
        my={4}
        gap={4}
        p={2}
        sx={{ border: "2px solid grey" }}
        style={{
          background: "#fff",
          width: "35%",
          textAlign: "center",
          margin: "auto",
          boxShadow: "0px 2px 20px rgba(10, 10, 10, 0.1)",
          borderRadius: "20px",
        }}
      >
        {/* Prompt for the user to select their role */}
        <Typography
          variant="h6"
          component="h2"
          style={{ color: "#000", marginBottom: "30px", paddingTop: "20px" }}
        >
          Please select your role:
        </Typography>
        {/* Buttons for role selection that navigate to different parts of the application */}
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          {/* Button for buyers */}
          <Button
            component={Link}
            variant="contained"
            color="primary"
            to="/buyer"
            style={{
              marginBottom: "20px",
            }}
          >
            Buyer
          </Button>
          {/* Button for sellers */}
          <Button
            component={Link}
            variant="contained"
            color="primary"
            to="/seller"
            style={{
              marginBottom: "20px",
            }}
          >
            Seller
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LandingPage;