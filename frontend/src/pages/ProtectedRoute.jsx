import React, { useEffect } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/user';

function ProtectedRoute(props) {
    const { Component } = props;
    const navigate = useNavigate();
    const { getUser } = useUser();

    useEffect(() => {
        const authenticateUser = () => {
            const authToken = Cookies.get("authToken");
            const username = Cookies.get("username");
            const image = Cookies.get("image");

            if (!authToken || !username || !image) navigate("/auth");
            // window.location.href = "/auth";
            else getUser();
        };

        authenticateUser();
    }, []);

    return (
        <div><Component /></div>
    )
}

export default ProtectedRoute