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
import axios from "axios";
import config from "../config";

function Editor() {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [explorerData, setExplorerData] = useState({});
  const [initialTabs, setInitialTabs] = useState([]);
  const [liveUsers, setLiveUsers] = useState([]);

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

  const getLiveUsers = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };

    try {
      const results = await axios.get(
        (config.BACKEND_API || "http://localhost:8000") +
          `/project/get-live-users?username=${window.localStorage.getItem(
            "username"
          )}&projectId=${projectId}`,
        { headers }
      );
      console.log("getLiveUsers", results.data);
      setLiveUsers((prev) => results.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLiveUsers();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const liveUserJoined = ({ username }) => {
      setLiveUsers((prev) => {
        // Check if the username already exists
        const usernameExists = prev.some((user) => user.username === username);

        // If username already exists, return the previous state
        if (usernameExists) return prev;

        // Return a new array with the new user added
        return [...prev, { username }];
      });
    };

    const liveUserLeft = ({ username }) => {
      setLiveUsers((prev) => {
        // Return a new array with the specified username removed
        return prev.filter((user) => user.username !== username);
      });
    };

    socket.on("editor:live-user-joined", liveUserJoined);
    socket.on("editor:live-user-left", liveUserLeft);

    return () => {
      socket.off("editor:live-user-joined", liveUserJoined);
      socket.off("editor:live-user-left", liveUserLeft);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("editor:join-project", {
      project_id: projectId,
      username: window.localStorage.getItem("username"),
    });
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
    // socket.emit("code-editor:user-left", {
    //   file_id: fileId,
    //   username: window.localStorage.getItem("username"),
    // });
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

  const getInitialTabs = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        (config.BACKEND_API || "http://localhost:8000") +
          `/project/get-initial-tabs?username=${window.localStorage.getItem(
            "username"
          )}&projectId=${projectId}`,
        { headers }
      );
      console.log(results.data);

      const data = results.data.map((file) => ({
        id: file.file_id,
        name: file.file_name,
        users: [
          {
            is_active_in_tab: file.is_active_in_tab,
            is_live: file.is_live,
            live_users_timestamp: file.live_users_timestamp,
            project_id: file.project_id,
            username: file.username,
          },
        ],
      }));

      setTabs((prev) => data);
      setInitialTabs((prev) => results.data);

      setSelectedFileId((prev) => {
        const activeFile = results.data.find((file) => file.is_active_in_tab);
        return activeFile ? activeFile.file_id : null; // Return the file_id or null if not found
      });
    } catch (err) {
      console.log("err ->", err);
    }
  };

  useEffect(() => {
    getInitialTabs();
  }, []);

  useEffect(() => {
    console.log("tabs", tabs);
  }, [tabs]);

  useEffect(() => {
    if (!socket) return;
    initialTabs.forEach((file) => {
      socket.emit("code-editor:join-file", { file_id: file.file_id });
    });
  }, [initialTabs]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("code-editor:join-file", { file_id: selectedFileId });
  }, [selectedFileId]);

  return (
    <Grid
      container
      direction="column"
      sx={{ height: "100", overflow: "hidden" }}
    >
      <Grid item>
        <Box sx={{ padding: 1, backgroundColor: "#f5f5f5" }}>
          <Tools liveUsers={liveUsers} />
        </Box>
      </Grid>
      <Grid container item sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Grid
          item
          xs={3}
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
            tabs={tabs}
            setTabs={setTabs}
            socket={socket}
            projectId={projectId}
            handleFileClick={handleFileClick}
            selectedFileId={selectedFileId}
            explorerData={explorerData}
            setExplorerData={setExplorerData}
          />
        </Grid>
        <Grid
          item
          xs={9}
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
                    <div
                      key={tab.id}
                      style={{
                        position: "relative",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          position: "abosulte",
                          zIndex: tab.id === selectedFileId ? 100 : 0,
                          width: "100%",
                          backgroundColor: "grey",
                        }}
                      >
                        <div>{tab.name}</div>
                        <CodeEditor
                          socket={socket}
                          fileId={tab.id}
                          username={window.localStorage.getItem("username")}
                          setTabs={setTabs}
                        />
                      </div>
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
