import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/anyword-hint";
import "codemirror/keymap/sublime";
import debounce from "lodash.debounce";

const CodeEditor = ({ socket, username }) => {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const isRemoteChange = useRef(false);
  const [users, setUsers] = useState({});
  const cursorElements = useRef({});

  useEffect(() => {
    const editor = CodeMirror.fromTextArea(editorRef.current, {
      mode: "javascript",
      theme: "monokai",
      keyMap: "sublime",
      lineNumbers: true,
      extraKeys: {
        "Ctrl-Space": "autocomplete",
      },
    });

    editorInstance.current = editor;

    const handleInputRead = debounce(function (cm, event) {
      if (!cm.state.completionActive && event.text[0].match(/\w/)) {
        cm.showHint({
          hint: CodeMirror.hint.anyword,
          completeSingle: false,
        });
      }
    }, 300);

    editor.on("inputRead", handleInputRead);

    editor.on("change", (instance, change) => {
      if (isRemoteChange.current || !change.origin) return;
      socket.emit("code-editor:send-change", change);
    });

    socket.on("code-editor:receive-change", (change) => {
      isRemoteChange.current = true;
      editor.operation(() => {
        editor.replaceRange(change.text, change.from, change.to, change.origin);
      });
      isRemoteChange.current = false;
    });

    editor.on("cursorActivity", (instance) => {
      // debounce(() => {
      const cursor = editor.getCursor();
      socket.emit("code-editor:send-cursor", { username, position: cursor });
      // }, 100)
    });

    socket.on("code-editor:receive-cursor", ({ username, position }) => {
      setUsers((prevUsers) => ({
        ...prevUsers,
        [username]: position,
      }));
    });

    socket.on("user:disconnect", ({ username }) => {
      setUsers((prevUsers) => {
        const newUsers = { ...prevUsers };
        delete newUsers[username];
        return newUsers;
      });
      // Remove cursor element for disconnected user
      if (cursorElements.current[username]) {
        cursorElements.current[username].remove();
        delete cursorElements.current[username];
      }
    });

    return () => {
      editor.toTextArea();
      socket.off("code-editor:receive-change");
      socket.off("code-editor:receive-cursor");
      socket.off("user:disconnect");
      socket.disconnect();
      // Clean up all cursor elements
      Object.values(cursorElements.current).forEach((el) => el.remove());
      cursorElements.current = {};
    };
  }, [socket, username]);

  useEffect(() => {
    const editor = editorInstance.current;
    if (!editor) return;

    Object.entries(users).forEach(([user, position]) => {
      if (user === username) return; // Don't show own cursor

      let cursorElement = cursorElements.current[user];

      if (!cursorElement) {
        // Create new cursor element if it doesn't exist
        cursorElement = document.createElement("div");
        cursorElement.className = "remote-cursor";
        cursorElement.style.position = "absolute";
        cursorElement.style.width = "2px";
        cursorElement.style.height = "20px";
        cursorElement.style.backgroundColor = getRandomColor(user);

        const labelElement = document.createElement("div");
        labelElement.className = "remote-cursor-label";
        labelElement.textContent = user;
        labelElement.style.position = "absolute";
        labelElement.style.left = "0";
        labelElement.style.top = "-20px";
        labelElement.style.backgroundColor = getRandomColor(user);
        labelElement.style.color = "white";
        labelElement.style.padding = "2px 4px";
        labelElement.style.borderRadius = "3px";
        labelElement.style.fontSize = "12px";

        cursorElement.appendChild(labelElement);
        editor.getWrapperElement().appendChild(cursorElement);
        cursorElements.current[user] = cursorElement;
      }

      // Update cursor position
      const cursorCoords = editor.cursorCoords(position, "local");
      cursorElement.style.left = `${cursorCoords.left + 29}px`;
      cursorElement.style.top = `${cursorCoords.top}px`;
    });
  }, [users, username]);

  const getRandomColor = (username) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
  };

  return (
    <div
      style={{
        border: "1px solid black",
        padding: "2px",
        position: "relative",
      }}
    >
      <textarea ref={editorRef}></textarea>
    </div>
  );
};

export default CodeEditor;
