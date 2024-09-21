import React, { useState, useEffect } from "react";
import Folder from "./Folder";
import useTraverseTree from "../hooks/use-traverse-tree";
import axios from "axios";
import config from "../config";

const buildFileTree = (fileTreeData, parentId = null) => {
  const items = fileTreeData
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      id: item.file_tree_id,
      parentId: item.parent_id,
      name: item.name,
      isFolder: item.is_folder,
      expand: false,
      fileTreeTimestamp: item.file_tree_timestamp,
      items: buildFileTree(fileTreeData, item.file_tree_id), // Recursively build the tree
    }));

  if (parentId === null) {
    return items.length ? items[0] : {};
  }

  return items;
};

function FileExplorer(props) {
  const { handleFileClick, selectedFileId, socket, projectId } = props;
  const [explorerData, setExplorerData] = useState({});
  const { insertNode } = useTraverseTree(socket);

  const handleInsertNode = (folderId, name, isFolder) => {
    socket.emit("file-explorer:insert-node", {
      new_node_parent_id: folderId,
      name: name,
      is_folder: isFolder,
    });
  };

  useEffect(() => {
    if (!socket) return;

    const insertHandler = (new_node) => {
      console.log("new_node", new_node);
      const finalTree = insertNode(explorerData, new_node);
      setExplorerData((prev) => finalTree);
    };

    // const deleteHandler = () => {};

    socket.on("file-explorer:insert-node", insertHandler);
    // socket.on("file-explorer:delete-node", deleteHandler);

    return () => {
      socket.off("file-explorer:insert-node", insertHandler);
      // socket.off("file-explorer:delete-node", deleteHandler);
    };
  }, [socket]);

  const getFileTree = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const { data } = await axios.get(
        (config.BACKEND_API || "http://localhost:8000") +
          `/project/get-file-tree?username=${window.localStorage.getItem(
            "username"
          )}&projectId=${projectId}`,
        { headers }
      );
      const tree = buildFileTree(data);
      console.log("tree", tree);
      setExplorerData((prev) => tree);
    } catch (err) {
      console.log("err ->", err);
    }
  };

  useEffect(() => {
    getFileTree();
  }, []);

  return (
    <Folder
      explorer={explorerData}
      handleInsertNode={handleInsertNode}
      handleFileClick={handleFileClick}
      selectedFileId={selectedFileId}
      makeExpandFolderParent={() => {}}
    />
  );
}

export default FileExplorer;
