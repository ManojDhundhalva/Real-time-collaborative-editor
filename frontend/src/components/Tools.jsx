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
import Contributor from "./Contributor";
import useAPI from "../hooks/api";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { useRef } from "react";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded"
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import Cookies from "js-cookie"
import User from "./User";

const CustomDialog = ({ open, handleClose, projectId }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();  // Close the modal if clicking outside of it
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  useEffect(() => {
    // Function to handle keydown event
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleClose(); // Call the function on pressing Escape
      }
    };

    // Add event listener for keydown
    document.addEventListener("keydown", handleEsc);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [handleClose]);

  if (!open) return null;

  return (
    <Box ref={modalRef}>
      <Contributor
        projectId={projectId}
        handleClose={handleClose}
      />
    </Box >
  );
};



// MenuButton component with custom styles
const MenuButton = styled(Button)({
  textTransform: "none",
  minWidth: "50px",
  fontSize: "0.9rem",
  padding: "0 10px",
});

const Tools = ({ liveUsers }) => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const { projectId } = useParams();
  const { GET } = useAPI();

  const [openDialog, setOpenDialog] = useState(false);
  const handleClickOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);


  useEffect(() => {
    const getProjectName = async () => {
      try {
        const results = await GET("/project/get-project-name", { projectId });
        console.log(results.data.project_name);
        setProjectName((prev) => results.data.project_name);
      } catch (err) {
        console.log("err ->", err);
      }
    };

    getProjectName();
  }, []);

  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const toggleProfile = (e) => {
    e.stopPropagation();
    setIsProfileVisible((prev) => !prev);
  }
  const handleCloseProfile = () => setIsProfileVisible(false);

  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        handleCloseProfile();  // Close the modal if clicking outside of it
      }
    }

    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleCloseProfile]);

  useEffect(() => {
    // Function to handle keydown event
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleCloseProfile(); // Call the function on pressing Escape
      }
    };

    // Add event listener for keydown
    document.addEventListener("keydown", handleEsc);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [handleCloseProfile]);

  return (
    <>
      <CustomDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        projectId={projectId}
      />
      <Box sx={{ display: "flex", p: 0, m: 0, borderBottom: "1px solid black" }}>
        {/* Left Section: Icon and Title */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <IconButton onClick={() => navigate("/project")}>
              <DescriptionRoundedIcon fontSize="large" sx={{ color: "black" }} />
            </IconButton>
            <Typography fontWeight="bold" fontSize="x-large">
              {projectName}
            </Typography>
          </Box>
        </Box>

        {/* Right Section: Icons and Avatar */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {liveUsers && liveUsers?.length > 0 &&
            liveUsers.map((liveUser, index) => (
              <Tooltip
                key={index}
                TransitionComponent={Zoom}
                title={
                  Cookies.get("username") === liveUser.username
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
                  sx={{ bgcolor: "#333333" }}
                  alt={liveUser.username}
                  src="/broken-image.jpg"
                >
                  {liveUser.username[0].toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}

          <Tooltip
            title="Add Contributors"
            leaveDelay={0}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "common.black",
                  color: "white",
                  transition: "none",
                },
              },
            }}
          >
            <button onClick={handleClickOpenDialog}>
              <GroupAddRoundedIcon />
            </button>
          </Tooltip>
          <Box>
            <Tooltip title="profile"
              enterDelay={200}
              leaveDelay={0}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "common.black",
                    "& .MuiTooltip-arrow": {
                      color: "common.black",
                    },
                  },
                },
              }}>
              <button style={{ border: "none" }} onClick={toggleProfile}>
                <AccountBoxRoundedIcon sx={{ color: "black" }} fontSize="large" />
              </button>
            </Tooltip>
            {isProfileVisible ? <Box ref={profileRef} sx={{ zIndex: 9999999, position: "absolute", right: 10, top: 54, bgcolor: "#FAFAFA", border: "1px solid black", borderRadius: "10px" }}>
              <User handleClose={handleCloseProfile} />
            </Box> : null}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Tools;