// module-imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// components
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

function Auth() {
  const [hasAccount, setHasAccount] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateUser = () => {
      const authToken = Cookies.get("authToken");
      const username = Cookies.get("username");
      const image = Cookies.get("image");

      if (authToken && username && image) navigate("/");
    };

    validateUser();
  }, []);

  return (
    <>
      {hasAccount ? (
        <Login hasAccount={hasAccount} setHasAccount={setHasAccount} />
      ) : (
        <Register hasAccount={hasAccount} setHasAccount={setHasAccount} />
      )}
    </>
  );
}

export default Auth;
