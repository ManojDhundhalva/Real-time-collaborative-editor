import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { toast } from "react-hot-toast";
import {
  Grid,
  Avatar,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import axios from "axios";
import config from "../config.js";

export default function LoginPage() {
  axios.defaults.withCredentials = true;

  const [loading, setLoading] = useState(false);
  const [justVerify, setJustVerify] = useState(false);
  const { setIsLoggedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const isSubmitValidForAllFields = () => {
    if (
      userName === "" ||
      userName.length >= 255 ||
      password === "" ||
      password.length < 8 ||
      password.length >= 255
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setJustVerify((prev) => true);
    if (!isSubmitValidForAllFields()) {
      return;
    }

    setLoading((prev) => true);

    try {
      const results = await axios.post(
        (config.BACKEND_API || "http://localhost:8000") + "/login",
        {
          username: userName,
          password,
        }
      );
      if (results.status === 200) {
        window.localStorage.setItem("token", results.data.token);
        window.localStorage.setItem("username", results.data.username);
        toast.success("Login successful!");
        setIsLoggedIn((prev) => true);
        navigate("/");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (err) {
      toast.error("Error Occured !!");
      console.log("error -> ", err);
    }
    setLoading((prev) => false);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        paddingX: { xs: 2, sm: 4 },
        paddingY: { xs: 4, sm: 6 },
        background:
          "radial-gradient(788px at 0.7% 3.4%, rgb(164, 231, 192) 0%, rgb(255, 255, 255) 90%)",
        backgroundSize: "cover",
      }}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={4}
        sx={{
          padding: { xs: 2, sm: 4 },
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          backdropFilter: "blur(12px)",
          backgroundColor: "transparent",
        }}
      >
        <Avatar sx={{ backgroundColor: "#134611", mb: 2 }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Sign in
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                color="success"
                value={userName}
                onChange={(e) => {
                  setUserName((prev) => e.target.value);
                }}
                id="username"
                label="Username / Email ID"
                placeholder="Username OR Email-ID"
                variant="outlined"
                fullWidth
                required
                size="small"
                autoComplete="on"
                error={
                  justVerify && (userName === "" || userName.length >= 255)
                }
                helperText={
                  justVerify &&
                  (userName === ""
                    ? "This field cannot be empty."
                    : userName.length >= 255
                    ? "username is too long"
                    : "")
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#134611" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 25,
                    fontWeight: "bold",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="success"
                value={password}
                onChange={(e) => {
                  setPassword((prev) => e.target.value);
                }}
                id="password"
                label="Password"
                placeholder="password"
                variant="outlined"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                size="small"
                autoComplete="on"
                error={
                  justVerify &&
                  (password === "" ||
                    password.length >= 255 ||
                    password.length < 8)
                }
                helperText={
                  justVerify &&
                  (password === ""
                    ? "This field cannot be empty."
                    : password.length < 8
                    ? "The password must contain at least 8 characters."
                    : password.length >= 255
                    ? "The password is too long"
                    : "")
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyRoundedIcon sx={{ color: "#134611" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <Visibility sx={{ color: "#134611" }} />
                        ) : (
                          <VisibilityOff sx={{ color: "#134611" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 25,
                    fontWeight: "bold",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  fontWeight: "bold",
                  borderRadius: "12px",
                  backgroundColor: "#134611",
                  color: "white",
                  "&:hover": {
                    color: "white",
                    backgroundColor: "#155d27",
                  },
                }}
              >
                {!loading ? "Sign In" : "Signing In"}
                {loading && <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
                {loading && (
                  <CircularProgress
                    size={20}
                    sx={{
                      color: "white",
                      right: 0,
                    }}
                  />
                )}
              </Button>
            </Grid>
            <Grid item container justifyContent="space-between" xs={12}>
              <Button
                variant="text"
                onClick={() => {
                  navigate("/register");
                }}
                sx={{
                  fontWeight: "bold",
                  color: "#134611",
                  textDecoration: "underline",
                }}
              >
                Don't have an account? Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
