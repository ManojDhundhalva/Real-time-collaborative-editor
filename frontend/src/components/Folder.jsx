import React, { useState, useEffect } from "react";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Button, IconButton, Zoom, Tooltip } from "@mui/material/";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

const Folder = (props) => {
  const {
    explorer,
    handleInsertNode,
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
    if (selectedFileId === explorer.id) {
      makeExpandFolderParent();
    }
  }, [selectedFileId]);

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
      <div
        onClick={() => {
          onFileClick({ id: explorer.id, name: explorer.name });
        }}
        style={{
          cursor: "pointer",
          background: selectedFileId === explorer.id ? "lightblue" : "white",
        }}
      >
        📄 {explorer.name}
      </div>
    );
  }
};

export default Folder;
