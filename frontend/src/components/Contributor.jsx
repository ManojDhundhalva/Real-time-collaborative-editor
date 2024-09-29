import { useEffect, useRef, useState } from "react";
import {
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  Box,
  InputAdornment,
  Button,
  ListItemAvatar,
} from "@mui/material";
import { Avatar } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import axios from "axios"; // Import Axios

function Contributor(props) {
  const { projectId, handleContributor } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserSet, setSelectedUserSet] = useState(new Set());
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const inputRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setActiveSuggestion(0);
      if (searchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${window.localStorage.getItem("token")}`,
      };

      try {
        const response = await axios.get(
          `http://localhost:8000/project/users/search?username=${window.localStorage.getItem(
            "username"
          )}&q=${searchTerm}&projectId=${projectId}`,
          { headers }
        );
        console.log(response.data);
        setSuggestions(response.data); // Use the data directly
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) => [...prev, user]);
    setSelectedUserSet((prev) => new Set([...prev, user.emailid])); // Adjusted for emailid
    setSearchTerm("");
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleRemoveUser = (user) => {
    const updatedUsers = selectedUsers.filter(
      (selectedUser) => selectedUser.id !== user.id
    );
    setSelectedUsers(updatedUsers);

    const updatedEmails = new Set(selectedUserSet);
    updatedEmails.delete(user.emailid); // Adjusted for emailid
    setSelectedUserSet(updatedEmails);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" && suggestions.length > 0) {
      e.preventDefault();
      setActiveSuggestion((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp" && suggestions.length > 0) {
      e.preventDefault();
      setActiveSuggestion((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (
      e.key === "Enter" &&
      activeSuggestion >= 0 &&
      activeSuggestion < suggestions.length
    ) {
      handleSelectUser(suggestions[activeSuggestion]);
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}
    >
      {/* Pills */}
      {selectedUsers.map((user) => (
        <Chip
          key={user.emailid} // Adjusted for emailid
          label={`${user.firstname} ${user.lastname}`} // Adjusted for firstname and lastname
          onDelete={() => handleRemoveUser(user)}
          avatar={<Avatar src={user.image || ""} />} // Adjusted for image, provide a default if necessary
          sx={{ height: "40px", display: "flex", alignItems: "center" }}
        />
      ))}
      {/* Input field with search suggestions */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            inputRef={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="contributors"
            label="Contributors"
            placeholder="Search For a User..."
            onKeyDown={handleKeyDown}
            fullWidth
            variant="outlined"
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
              handleContributor(selectedUsers);
            }}
            variant="contained"
            autoFocus
            sx={{ borderRadius: 2 }}
          >
            Add
          </Button>
        </Box>
        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <Box
            // id="style-1"
            sx={{
              maxHeight: "300px",
              overflowY: "auto",
              top: "100%",
              left: 0,
              right: 0,
              bgcolor: "background.paper",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: 3,
            }}
          >
            <List sx={{ padding: 1, margin: 0 }}>
              {suggestions.map(
                (user, index) =>
                  !selectedUserSet.has(user.emailid) && ( // Adjusted for emailid
                    <ListItem
                      sx={{ borderRadius: 1 }}
                      button
                      key={user.emailid} // Adjusted for emailid
                      selected={index === activeSuggestion}
                      onClick={() => handleSelectUser(user)}
                    >
                      <ListItemAvatar>
                        <Avatar src={user.image} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${user.firstname} ${user.lastname}`} // Adjusted for firstname and lastname
                      />
                    </ListItem>
                  )
              )}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Contributor;
