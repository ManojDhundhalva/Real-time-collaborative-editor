// module-imports
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

//Pages
import Auth from "./pages/Auth";
import Editor from "./pages/Editor";
import AboutUS from "./pages/AboutUs";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";

//components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// import TextEditor from "./components/TextEditor";
import Cookies from "js-cookie";
import { useUser } from "./context/user";

//css
import "./CSS/App.css";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "Quicksand",
    },
  });

  const { getUser } = useUser();
  const location = useLocation();
  const paths = ["/"];
  const isPath = paths.includes(location.pathname);

  useEffect(() => {
    if (!Cookies.get("authToken") || !Cookies.get("username")) return;
    getUser();
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        {isPath && <Navbar />}
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/auth" element={<Auth />} />
          <Route exact path="/aboutus" element={<AboutUS />} />
          <Route exact path="/project" element={<ProjectPage />} />
          <Route exact path="/project/:projectId" element={<Editor />} />
        </Routes>
        {isPath && <Footer />}
      </ThemeProvider>
    </>
  );
}
export default App;
