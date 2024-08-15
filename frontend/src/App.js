import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

//Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AboutUS from "./pages/AboutUs";

//components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

//css
import "./CSS/App.css";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "Quicksand",
    },
  });

  const location = useLocation();
  const hiddenPaths = ["/login", "/register"];
  const isHiddenPath = hiddenPaths.includes(location.pathname);

  return (
    <>
      <ThemeProvider theme={theme}>
        {!isHiddenPath && <Navbar />}
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/profile" element={<ProfilePage />} />
          <Route exact path="/aboutus" element={<AboutUS />} />
        </Routes>
        {!isHiddenPath && <Footer />}
      </ThemeProvider>
    </>
  );
}
export default App;
