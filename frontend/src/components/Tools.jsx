import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Grid,
  DialogActions,
  InputAdornment,
  Tooltip,
  Zoom,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ShareIcon from "@mui/icons-material/Share";
import HistoryIcon from "@mui/icons-material/History";
import CommentIcon from "@mui/icons-material/Comment";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import Avatar from "@mui/material/Avatar";
import DescriptionIcon from "@mui/icons-material/Description";
import { styled } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import config from "../config";
import toast from "react-hot-toast";

// MenuButton component with custom styles
const MenuButton = styled(Button)({
  textTransform: "none",
  minWidth: "50px",
  fontSize: "0.9rem",
  padding: "0 10px",
});

const Tools = ({ liveUsers }) => {
  const [contributor, setContributor] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const { projectId } = useParams();

  const getProjectName = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        (config.BACKEND_API || "http://localhost:8000") +
          `/project/get-project-name?username=${window.localStorage.getItem(
            "username"
          )}&projectId=${projectId}`,
        { headers }
      );
      console.log(results.data.project_name);
      setProjectName((prev) => results.data.project_name);
    } catch (err) {
      console.log("err ->", err);
    }
  };

  const addContributor = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.post(
        (config.BACKEND_API || "http://localhost:8000") +
          `/project/add-contributor?username=${window.localStorage.getItem(
            "username"
          )}`,
        { projectId, contributor },
        { headers }
      );
      console.log(results);
      toast.success(`Added, "${contributor}"`);
      setContributor((prev) => "");
    } catch (err) {
      console.log("err ->", err);
      toast.success(`NOT Added, "${contributor}"`);
    }
  };

  useEffect(() => {
    getProjectName();
  }, []);
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            border: "none",
            borderRadius: 3, // Optional: Set border-radius
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)", // Custom box shadow
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">Add Contributor</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <TextField
              color="primary"
              value={contributor}
              onChange={(e) => {
                setContributor((prev) => e.target.value);
              }}
              id="contributor"
              label="Contributor"
              placeholder="Username"
              variant="outlined"
              fullWidth
              size="small"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon sx={{ color: "#1976D2" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                m: 1,
                width: "380px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  fontWeight: "bold",
                },
              }}
            />
            <Button
              onClick={() => {
                handleClose();
                addContributor();
              }}
              variant="contained"
              autoFocus
              sx={{ borderRadius: 2 }}
            >
              Add
            </Button>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            {/* Left Section: Icon and Title */}
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <IconButton
                onClick={() => {
                  navigate("/project");
                }}
              >
                <DescriptionIcon color="primary" fontSize="large" />
              </IconButton>
              <Box>
                <MenuButton>
                  <Typography variant="h6">{projectName}</Typography>
                </MenuButton>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexGrow: 1,
                  }}
                >
                  {[
                    "File",
                    "Edit",
                    "View",
                    "Insert",
                    "Format",
                    "Tools",
                    "Extensions",
                    "Help",
                  ].map((item) => (
                    <MenuButton key={item} color="inherit">
                      {item}
                    </MenuButton>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Right Section: Icons and Avatar */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {liveUsers &&
                liveUsers?.length > 0 &&
                liveUsers.map((liveUser, index) => (
                  <Tooltip
                    key={index}
                    TransitionComponent={Zoom}
                    title={
                      window.localStorage.getItem("username") ===
                      liveUser.username
                        ? "You"
                        : liveUser.username
                    }
                    placement="bottom"
                    arrow
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: "common.black",
                          "& .MuiTooltip-arrow": {
                            color: "common.black",
                          },
                        },
                      },
                    }}
                  >
                    <Avatar
                      key={index}
                      sx={{ bgcolor: "green" }}
                      alt={liveUser.username}
                      src="/broken-image.jpg"
                    >
                      {liveUser.username[0].toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              <Button
                onClick={handleClickOpen}
                variant="outlined"
                startIcon={<GroupAddRoundedIcon />}
              >
                Add contributors
              </Button>
              <IconButton color="inherit">
                <HistoryIcon />
              </IconButton>
              <IconButton color="inherit">
                <CommentIcon />
              </IconButton>
              <IconButton color="inherit">
                <VideoCallIcon />
              </IconButton>
              <IconButton color="inherit">
                <ShareIcon />
              </IconButton>
              <Avatar sx={{ marginLeft: 2 }} />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Tools;
