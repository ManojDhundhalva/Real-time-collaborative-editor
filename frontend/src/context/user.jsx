import React, { createContext, useContext, useState } from "react";
import useAPI from "../hooks/api";
import { toast } from "react-hot-toast";

const userContext = createContext();

export const UserProvider = ({ children }) => {

    const { GET, POST } = useAPI();

    const [userName, setUserName] = useState("N/A");
    const [email, setEmail] = useState("N/A");
    const [firstName, setFirstName] = useState("N/A");
    const [lastName, setLastName] = useState("N/A");
    const [userTimestamp, setUserTimestamp] = useState("N/A");
    const [updatedOn, setUpdatedOn] = useState("N/A");

    const getUser = async () => {
        try {
            const { data } = await GET("/user");
            setUserName(data.username);
            setEmail(data.emailid);
            setFirstName(data.firstname);
            setLastName(data.lastname);
            setUserTimestamp(data.user_timestamp);
            setUpdatedOn(data.updated_on);
        } catch (error) {
            console.error("Error fetching user data: ", error);
            toast.error("Error fetching user data");
        }
    };

    return (
        <userContext.Provider value={{
            userName,
            email,
            firstName,
            lastName,
            updatedOn,
            userTimestamp,
            getUser,
        }}>
            {children}
        </userContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(userContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
