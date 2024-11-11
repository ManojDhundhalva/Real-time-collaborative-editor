import React, { useState } from 'react'
import { useUser } from '../context/user'
import { DateFormatter } from "../utils/formatters"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Typography, Avatar } from '@mui/material';
import { TextField, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CircularProgress from '@mui/material/CircularProgress';
import useAPI from '../hooks/api';
import { toast } from 'react-hot-toast';
import { isAlphabetic } from '../utils/validation';

function User(props) {
    const { handleClose } = props;
    const { POST } = useAPI();
    const { userName, email, firstName, lastName, userTimestamp, updatedOn, getUser } = useUser();

    const [first, setFirst] = useState(firstName);
    const [last, setLast] = useState(lastName);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [justVerify, setJustVerify] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        setJustVerify(true);

        if (first.trim() === "" || last.trim() === "") return;

        setIsUpdatingProfile(true);
        try {
            await POST("/user", { firstname: first, lastname: last });
            toast.success("Profile updated successfully");
            getUser();
        } catch (error) {
            console.error("Error updating user data: ", error);
            toast.error("Error updating user data");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleFirstChange = (e) => {

        if (!isAlphabetic(e.target.value)) return;
        setFirst(e.target.value); // Update state only if it matches the pattern
        setJustVerify(true);
    };

    const handleLastChange = (e) => {
        if (!isAlphabetic(e.target.value)) return;
        setLast(e.target.value); // Update state only if it matches the pattern
        setJustVerify(true);
    }

    return (
        <>
            <Box sx={{ minWidth: "400px", minHeight: "300px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                <Box sx={{ m: 1 }}>
                    <Typography fontWeight="bold" sx={{ color: "#666666" }}>{email || "email: N/A"}</Typography>
                </Box>
                <Box sx={{ position: "absolute", right: 0, top: 0, m: 1 }}>
                    <CloseRoundedIcon
                        onClick={handleClose}
                        sx={{
                            cursor: 'pointer',
                            fontWeight: "bold",
                            color: 'black',
                            borderRadius: '5px',
                            '&:hover': { bgcolor: '#CCCCCC' },
                        }}
                    />
                </Box>
                <Box sx={{ m: 1 }}>
                    <Avatar
                        sx={{ bgcolor: "#333333", width: 80, height: 80, fontSize: 40 }}
                        alt={userName}
                        src="/broken-image.jpg"
                    >
                        {userName[0].toUpperCase()}
                    </Avatar>
                </Box>
                <Box sx={{ m: 1 }}  >
                    <Typography fontWeight="bold" variant='h5' sx={{ color: "#333333" }}>Hii, {userName || "N/A"}!</Typography>
                </Box>
                <form onSubmit={handleUpdateProfile} style={{ margin: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                    <Box sx={{ m: 1 }}>
                        <TextField
                            value={first}
                            onChange={handleFirstChange}
                            id="firstname"
                            label="First Name"
                            placeholder="John"
                            variant="outlined"
                            fullWidth
                            required
                            size="small"
                            error={
                                justVerify && (first === "" || first.length >= 255)
                            }
                            helperText={
                                justVerify &&
                                (first.trim() === ""
                                    ? "This field cannot be empty."
                                    : first.length >= 255 ? "First Name is too long." : "")
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ color: "black" }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                color: "black",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    fontWeight: "bold",
                                    "&.Mui-focused fieldset": {
                                        borderColor: "black", // Keep the border color when focused
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "black", // Change the label color
                                    "&.Mui-focused": {
                                        color: "black", // Change the label color
                                    },
                                },
                            }}
                        />
                    </Box>
                    <Box sx={{ m: 1 }}>
                        <TextField
                            value={last}
                            onChange={handleLastChange}
                            id="lastname"
                            label="Last Name"
                            placeholder="Doe"
                            variant="outlined"
                            fullWidth
                            required
                            size="small"
                            error={
                                justVerify && (last === "" || last.length >= 255)
                            }
                            helperText={
                                justVerify &&
                                (last.trim() === ""
                                    ? "This field cannot be empty."
                                    : last.length >= 255 ? "Last Name is too long." : "")
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ color: "black" }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                color: "black",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    fontWeight: "bold",
                                    "&.Mui-focused fieldset": {
                                        borderColor: "black", // Keep the border color when focused
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "black", // Change the label color
                                    "&.Mui-focused": {
                                        color: "black", // Change the label color
                                    },
                                },
                            }}
                        />
                    </Box>
                    <Box sx={{ m: 1 }}>
                        <button type="submit" style={{ fontWeight: "bold" }}>
                            {isUpdatingProfile ? (
                                <>
                                    Updating... &nbsp;&nbsp;
                                    <CircularProgress size={20} thickness={6}
                                        sx={{
                                            color: "black",
                                            '& circle': { strokeLinecap: 'round' },
                                        }}
                                    />
                                </>
                            ) : ("Update")}
                        </button>
                    </Box>
                </form>
                <Box sx={{ m: 1, display: "flex", flexDirection: "column" }}>
                    <Typography fontWeight="bold" variant='caption' sx={{ color: "#666666" }}>Created On: {DateFormatter(userTimestamp) || "N/A"}</Typography>
                    <Typography fontWeight="bold" variant='caption' sx={{ color: "#666666" }}>Updated On: {DateFormatter(updatedOn) || "N/A"}</Typography>
                </Box>
            </Box>
        </>
    )
}

export default User