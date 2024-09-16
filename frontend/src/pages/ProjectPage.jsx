import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  InputBase,
  Typography,
  Box,
  Avatar,
  Grid,
  Button,
  useTheme,
  CardActionArea,
  Card,
  CardMedia,
  CardContent,
  Container,
  Zoom,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Link,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GridOnRoundedIcon from "@mui/icons-material/GridOnRounded";
import SortByAlphaRoundedIcon from "@mui/icons-material/SortByAlphaRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import axios from "axios";
import config from "../config";
import { toast } from "react-hot-toast";

const files = [
  { name: "CSES_Manoj", owner: "me", date: "9 Jul 2024" },
  { name: "QUERIES", type: "doc", owner: "me", date: "23 Apr 2024" },
  {
    name: "WoC 6.0 React JS.docx",
    type: "docx",
    owner: "202201503",
    date: "28 Dec 2023",
  },
  {
    name: "WoC 6.0 Node JS",
    type: "docx",
    owner: "202201208",
    date: "28 Dec 2023",
  },
  {
    name: "React Js: IRCTC .docx",
    type: "docx",
    owner: "me",
    date: "16 Dec 2023",
  },
  {
    name: "React Js: IRCTC",
    type: "docx",
    owner: "pateljeet3004",
    date: "16 Dec 2023",
  },
];

function ProjectPage() {
  const [searchValue, setSearchValue] = useState("");
  const [projectName, setProjectName] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open_ = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose_ = () => {
    setAnchorEl(null);
  };

  const [allProjects, setAllProjects] = useState([]);

  const getAllProjects = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        (config.BACKEND_API || "http://localhost:8000") +
          `/project/get-all-projects?username=${window.localStorage.getItem(
            "username"
          )}`,
        { headers }
      );
      console.log(results.data);
      setAllProjects((prev) => results.data);
    } catch (err) {
      console.log("err ->", err);
    }
  };

  const addProject = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.post(
        (config.BACKEND_API || "http://localhost:8000") +
          `/project/add-project?username=${window.localStorage.getItem(
            "username"
          )}`,
        { projectName },
        { headers }
      );
      console.log(results.data);
      toast.success(`Created project, "${projectName}"`);
      navigate(`/project/${results.data.project_id}`);
    } catch (err) {
      console.log("err ->", err);
      toast.error("NOT ADDED");
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    // Extract time part
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const time = date.toLocaleString("en-US", timeOptions); // e.g., "2:30 PM"

    // Extract date part
    const dateOptions = {
      day: "numeric",
      month: "short", // "Sep"
      year: "numeric",
    };
    const formattedDate = date.toLocaleString("en-US", dateOptions); // e.g., "9 Sep, 2020"

    return `${time} ${formattedDate}`;
  };

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
        <DialogTitle id="alert-dialog-title">Create Project</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              color="primary"
              value={projectName}
              onChange={(e) => {
                setProjectName((prev) => e.target.value);
              }}
              id="project-name"
              label="Project Name"
              placeholder="Project Name"
              variant="outlined"
              fullWidth
              required
              size="small"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FolderRoundedIcon sx={{ color: "#1976D2" }} />
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
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            // variant="outlined"
            variant="text"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              addProject();
              handleClose();
            }}
            variant="contained"
            autoFocus
            sx={{ borderRadius: 2 }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 2,
          bgcolor: theme.palette.background.paper,
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
          position: "sticky",
          top: 0,
          zIndex: theme.zIndex.appBar,
        }}
      >
        <IconButton>
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
          <DescriptionIcon color="primary" fontSize="large" />
          <Typography
            variant="h6"
            sx={{ ml: 1, color: theme.palette.text.primary }}
          >
            Docs
          </Typography>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            mx: 4,
            display: "flex",
            alignItems: "center",
            bgcolor: "#F0F4F9",
            borderRadius: 4,
            px: 2,
            py: 1,
          }}
        >
          <SearchIcon color="action" />
          <InputBase
            value={searchValue}
            onChange={handleInputChange}
            placeholder="Search"
            sx={{
              ml: 1,
              flexGrow: 1,
              fontSize: "1rem",
              bgcolor: "transparent",
              fontWeight: "bold",
            }}
          />
        </Box>

        <Avatar src="/broken-image.jpg" />
      </Box>
      <Box sx={{ bgcolor: "#F1F3F4", py: 4 }}>
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            px: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: "text.secondary" }}>
              Start a new project
            </Typography>

            <IconButton color="default">
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Card
            sx={{
              width: 160,
              height: 200,
              border: "1px solid #999999", // Initial border to handle the hover effect properly
              transition: "border 0.3s ease", // Smooth transition for the border effect
              "&:hover": {
                border: "1px solid black",
              },
            }}
          >
            <CardActionArea onClick={handleClickOpen}>
              <CardMedia
                component="img"
                alt="Blank Document"
                height="140"
                image="https://links.papareact.com/pju"
              />
              <CardContent>
                <Typography variant="body1">Blank</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Grid
            container
            alignItems="center"
            sx={{
              p: 1,
              m: 1,
            }}
          >
            <Grid
              item
              xs={7}
              sm={7}
              md={7}
              sx={{ display: "flex", justifyContent: "flex-start" }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "#4D4D4D", px: 1 }}
              >
                Today
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sm={2}
              md={2}
              sx={{ display: "flex", justifyContent: "flex-start" }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "#4D4D4D" }}
              >
                Created On
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sm={2}
              md={2}
              sx={{ display: "flex", justifyContent: "flex-start" }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "#4D4D4D" }}
              >
                Last opened by me
              </Typography>
            </Grid>
            <Grid
              item
              xs={1}
              sm={1}
              md={1}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Tooltip
                TransitionComponent={Zoom}
                title="Grid view"
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
                <IconButton aria-label="grid">
                  <GridOnRoundedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                TransitionComponent={Zoom}
                title="Sort"
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
                <IconButton aria-label="sort">
                  <SortByAlphaRoundedIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Container maxWidth="lg">
        <Box sx={{ mt: 2 }}>
          {allProjects.length > 0 &&
            allProjects.map((item, index) => (
              <Grid
                onClick={() => {
                  navigate(`/project/${item.project_id}`);
                }}
                key={index}
                container
                alignItems="center"
                sx={{
                  p: 1,
                  m: 1,
                  borderBottom: "1px solid #F1F3F4",
                  cursor: "pointer",
                  "&:hover": {
                    borderRadius: 4,
                    bgcolor: "#E8F0FE",
                    borderBottom: "1px solid transparent",
                  },
                }}
              >
                <Grid
                  item
                  xs={7}
                  sm={7}
                  md={7}
                  sx={{ display: "flex", px: 1, justifyContent: "flex-start" }}
                >
                  <DescriptionIcon color="primary" />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{
                      color: "#4D4D4D",
                      px: 2,
                    }}
                  >
                    {item.project_name}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sm={2}
                  md={2}
                  sx={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <Typography variant="subtitle2">
                    {formatTimestamp(item.project_timestamp)}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sm={2}
                  md={2}
                  sx={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <Typography variant="subtitle2">
                    {formatTimestamp(item.last_opened)}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <div>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(e);
                      }}
                      id="basic-button"
                      aria-controls={open_ ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open_ ? "true" : undefined}
                    >
                      <MoreVertIcon />
                    </IconButton>

                    <Menu
                      sx={{
                        ".MuiPaper-root": {
                          boxShadow: "rgba(0, 0, 0, 0.07) 0px 1px 4px",
                        },
                      }}
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open_}
                      onClose={handleClose_}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={handleClose_}>
                        <Grid
                          sx={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            width: "140px",
                          }}
                        >
                          <Grid>
                            <TextFieldsRoundedIcon />
                          </Grid>
                          <Grid>
                            <Typography>Rename</Typography>
                          </Grid>
                        </Grid>
                      </MenuItem>
                      <MenuItem onClick={handleClose_}>
                        <Grid
                          sx={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            width: "140px",
                          }}
                        >
                          <Grid>
                            <DeleteRoundedIcon />
                          </Grid>
                          <Grid>
                            <Typography>Remove</Typography>
                          </Grid>
                        </Grid>
                      </MenuItem>
                    </Menu>
                  </div>
                </Grid>
              </Grid>
            ))}
        </Box>
      </Container>
      <div className="mb-5">&nbsp;</div>
    </>
  );
}

export default ProjectPage;
