import React from "react";
import home from "../images/home.png";
import { Box } from "@mui/material";
import User from "../components/User";

function HomePage() {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", py: 8 }}>
        <img src={home} alt="home"
          style={{ width: 1000, objectFit: "contain" }}
        />
      </Box>
      <User />
    </>
  );
}

export default HomePage;
