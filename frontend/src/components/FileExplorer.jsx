import React, { useState, useEffect } from "react";
import Folder from "./Folder";
import useTraverseTree from "../hooks/use-traverse-tree";
import axios from "axios";
import config from "../config";

// Build the tree from flat file structure
const buildFileTree = (fileTreeData, parentId = null) => {
  const items = fileTreeData
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      id: item.file_tree_id,
      parentId: item.parent_id,
      name: item.name,
      isFolder: item.is_folder,
      expand: item.expand,
      fileTreeTimestamp: item.file_tree_timestamp,
      items: buildFileTree(fileTreeData, item.file_tree_id), // Recursively build the tree
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name

  if (parentId === null) {
    return items.length ? items[0] : {};
  }

  return items;
};

function FileExplorer(props) {
  const {
    handleFileClick,
    selectedFileId,
    socket,
    projectId,
    setTabs,
    tabs,
    explorerData,
    setExplorerData,
  } = props;

  const { insertNode, deleteNode } = useTraverseTree();

  // Emit an event to add a node (file/folder)
  const handleInsertNode = (folderId, name, isFolder) => {
    socket.emit("file-explorer:insert-node", {
      new_node_parent_id: folderId,
      name: name,
      is_folder: isFolder,
    });
  };

  // Emit an event to delete a node
  const handleDeleteNode = (nodeId) => {
    socket.emit("file-explorer:delete-node", { node_id: nodeId });
  };

  useEffect(() => {
    if (!socket) return;

    // Handler for inserting a node
    const insertHandler = (new_node) => {
      const finalTree = insertNode(explorerData, new_node);
      setExplorerData({ ...finalTree }); // Ensure immutability to trigger re-render
    };

    // Handler for deleting a node
    const deleteHandler = ({ node_id: nodeId }) => {
      console.log("nodeId", nodeId);
      const finalTree = deleteNode(explorerData, nodeId);
      setExplorerData({ ...finalTree }); // Ensure immutability to trigger re-render
    };

    socket.on("file-explorer:insert-node", insertHandler);
    socket.on("file-explorer:delete-node", deleteHandler);

    return () => {
      socket.off("file-explorer:insert-node", insertHandler);
      socket.off("file-explorer:delete-node", deleteHandler);
    };
  }, [socket, explorerData]); // Add explorerData as dependency

  // Fetch file tree from server
  const getFileTree = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const s = `${
        config.BACKEND_API || "http://localhost:8000"
      }/project/get-file-tree?username=${window.localStorage.getItem(
        "username"
      )}&projectId=${projectId}`;

      console.log(s);
      const { data } = await axios.get(
        `${
          config.BACKEND_API || "http://localhost:8000"
        }/project/get-file-tree?username=${window.localStorage.getItem(
          "username"
        )}&projectId=${projectId}`,
        {
          headers,
        }
      );
      console.log("data", data);
      const tree = buildFileTree(data);
      setExplorerData({ ...tree }); // Ensure new object to trigger re-render
    } catch (err) {
      console.log("err ->", err);
    }
  };

  useEffect(() => {
    getFileTree();
  }, [projectId]); // Re-fetch when projectId changes

  return (
    <Folder
      explorer={explorerData}
      handleInsertNode={handleInsertNode}
      handleDeleteNode={handleDeleteNode}
      handleFileClick={handleFileClick}
      selectedFileId={selectedFileId}
      makeExpandFolderParent={() => {}}
    />
  );
}

export default FileExplorer;
