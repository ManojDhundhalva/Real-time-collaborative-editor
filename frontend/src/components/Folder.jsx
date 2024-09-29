import React, { useState, useEffect } from "react";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Button,
  IconButton,
  Zoom,
  Tooltip,
  Menu,
  Fade,
  Typography,
} from "@mui/material/";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment";
import axios from "axios";
import config from "../config";

const DateFormatter = (dateString) => {
  // Convert and format the date using moment
  const formattedDate = moment(dateString).format("MMMM D, YYYY, h:mm A");
  return formattedDate;
};

const Folder = (props) => {
  const {
    explorer,
    handleInsertNode,
    handleDeleteNode,
    handleFileClick,
    selectedFileId,
    makeExpandFolderParent,
  } = props;

  const [expand, setExpand] = useState(explorer.expand || false);
  const [showInput, setShowInput] = useState({
    isVisible: false,
    isFolder: null,
  });

  const handleNewFolder = (e, isFolder) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput((prev) => ({ isVisible: true, isFolder }));
  };

  const onAddFolder = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      handleInsertNode(explorer.id, e.target.value, showInput.isFolder);
      setShowInput({ ...showInput, isVisible: false });
    }
  };

  const onFileClick = (file) => {
    if (typeof handleFileClick === "function") {
      makeExpandFolderParent();
      setExpand((prev) => true);
      handleFileClick(file);
    }
  };

  const makeExpand = () => {
    makeExpandFolderParent();
    setExpand((prev) => true);
  };

  useEffect(() => {
    const setExpandData = async () => {
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${window.localStorage.getItem("token")}`,
      };

      try {
        const results = await axios.post(
          (config.BACKEND_API || "http://localhost:8000") +
            `/project/set-expand-data?username=${window.localStorage.getItem(
              "username"
            )}`,
          { expand, file_tree_id: explorer.id },
          { headers }
        );
        console.log("setExpandData", results.data);
      } catch (error) {
        console.log(error);
      }
    };

    setExpandData();  
  }, [expand]);

  useEffect(() => {
    if (selectedFileId === explorer.id) {
      makeExpandFolderParent();
    }
  }, [selectedFileId]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (explorer.isFolder) {
    return (
      <div>
        <div
          style={{
            cursor: "pointer",
            background: "lightgrey",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={() => setExpand((prev) => !expand)}
        >
          <div>
            {expand ? (
              <KeyboardArrowDownRoundedIcon />
            ) : (
              <KeyboardArrowRightRoundedIcon />
            )}
            📁 {explorer.name}
          </div>
          <div>
            <Tooltip
              TransitionComponent={Zoom}
              title={"New Folder"}
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
              <IconButton
                aria-label="folder"
                color="primary"
                size="small"
                onClick={(e) => handleNewFolder(e, true)}
              >
                <FolderOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip
              TransitionComponent={Zoom}
              title={"New File"}
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
              <IconButton
                aria-label="file"
                color="primary"
                size="small"
                onClick={(e) => handleNewFolder(e, false)}
              >
                <InsertDriveFileOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip
              TransitionComponent={Zoom}
              title={"Delete"}
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
              <IconButton
                aria-label="file"
                color="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNode(explorer.id);
                }}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip
              TransitionComponent={Zoom}
              title={"Info"}
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
              <IconButton
                aria-label="info"
                color="info"
                size="small"
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
              <Menu
                id="fade-menu"
                MenuListProps={{
                  "aria-labelledby": "fade-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
              >
                <Typography>
                  Created On : {DateFormatter(explorer.fileTreeTimestamp)}
                </Typography>
              </Menu>
            </Tooltip>
          </div>
        </div>
        <div style={{ display: expand ? "block" : "none", paddingLeft: 10 }}>
          {showInput.isVisible && (
            <div style={{ display: "flex" }}>
              <div>{showInput.isFolder ? "📁" : "📄"}</div>
              <input
                type="text"
                onKeyDown={onAddFolder}
                onBlur={() => setShowInput({ ...showInput, isVisible: false })}
                autoFocus
              />
            </div>
          )}
          {explorer.items.map((exp) => (
            <Folder
              key={exp.id}
              explorer={exp}
              handleInsertNode={handleInsertNode}
              handleDeleteNode={handleDeleteNode}
              handleFileClick={handleFileClick}
              selectedFileId={selectedFileId}
              makeExpandFolderParent={makeExpand}
            />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          onClick={() => {
            onFileClick({ id: explorer.id, name: explorer.name, users: [] });
          }}
          style={{
            width: "100%",
            cursor: "pointer",
            background: selectedFileId === explorer.id ? "lightblue" : "white",
          }}
        >
          📄 {explorer.name}
        </div>
        <div>
          <Tooltip
            TransitionComponent={Zoom}
            title={"Delete"}
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
            <IconButton
              aria-label="file"
              color="primary"
              size="small"
              onClick={() => handleDeleteNode(explorer.id)}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
        <div>
          <Tooltip
            TransitionComponent={Zoom}
            title={"Info"}
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
            <IconButton
              aria-label="info"
              color="info"
              size="small"
              id="fade-button"
              aria-controls={open ? "fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
            <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
            >
              <Typography>
                Created On : {DateFormatter(explorer.fileTreeTimestamp)}
              </Typography>
            </Menu>
          </Tooltip>
        </div>
      </div>
    );
  }
};

export default Folder;
