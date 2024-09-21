// Editor.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Typography } from "@mui/material";
import FileExplorer from "../components/FileExplorer";
import Tabs from "../components/Tabs";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import CodeEditor from "../components/CodeEditor";
import Tools from "../components/Tools";

// Initial tabs
const initialTabs = [
  { id: "1", name: "Tab 1" },
  { id: "2", name: "Tab 2" },
  { id: "3", name: "Tab 3" },
];

function Editor() {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState(initialTabs);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [socket, setSocket] = useState(null);

  const params = useParams();
  const projectId = params?.projectId || null;

  useEffect(() => {
    const s = io("http://localhost:8000");

    // s.on("connect_error", (err) => console.log(err));
    // s.on("connect_failed", (err) => console.log(err));

    setSocket((prev) => s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit("editor:join-project", { project_id: projectId });
  }, [socket]);

  const handleFileClick = (file) => {
    setTabs((prevTabs) => {
      const selectedIndex = prevTabs.findIndex(
        (tab) => tab.id === selectedFileId
      );
      const fileIndex = prevTabs.findIndex((tab) => tab.id === file.id);

      if (fileIndex === -1) {
        const newTabs = [...prevTabs];
        if (selectedIndex === -1) {
          newTabs.push(file);
        } else {
          newTabs.splice(selectedIndex + 1, 0, file);
        }
        return newTabs;
      }
      return prevTabs;
    });
    setSelectedFileId(file.id);
  };

  const handleCloseTab = (fileId) => {
    setTabs((prevTabs) => {
      const updatedTabs = prevTabs.filter((tab) => tab.id !== fileId);
      if (selectedFileId === fileId) {
        const newSelectedFileId =
          updatedTabs.length > 0
            ? updatedTabs[updatedTabs.length - 1].id
            : null;
        setSelectedFileId(newSelectedFileId);
      }
      return updatedTabs;
    });
  };

  return (
    <Grid
      container
      direction="column"
      sx={{ height: "100vh", overflow: "hidden" }}
    >
      <Grid item>
        <Box sx={{ padding: 1, backgroundColor: "#f5f5f5" }}>
          <Typography variant="h6">Editor</Typography>
          <Tools />
        </Box>
      </Grid>
      <Grid container item sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Grid
          item
          xs={2}
          sx={{
            height: "100%",
            backgroundColor: "lavender",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ paddingBottom: 1 }}>
            Explorer
          </Typography>
          <FileExplorer
            socket={socket}
            projectId={projectId}
            handleFileClick={handleFileClick}
            selectedFileId={selectedFileId}
          />
        </Grid>
        <Grid
          item
          xs={10}
          sx={{ height: "100%", padding: 0, width: "100%", overflow: "hidden" }}
        >
          <Grid>
            <Tabs
              tabs={tabs}
              setTabs={setTabs}
              selectedFileId={selectedFileId}
              handleFileClick={handleFileClick}
              handleCloseTab={handleCloseTab}
            />
          </Grid>

          <Grid sx={{ overflowY: "auto", width: "100%", height: "100%" }}>
            {tabs.length > 0 &&
              tabs.map(
                (tab) =>
                  tab && (
                    <div key={tab.id}>
                      {tab.id === selectedFileId ? (
                        <>
                          <div>{tab.name}</div>
                          <CodeEditor
                            socket={socket}
                            username={window.localStorage.getItem("username")}
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  )
              )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Editor;
