import { createContext, useState, useEffect } from "react";
import api from "./api.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext({
  token: "",
  onLogin: () => {},
  onLogout: () => {},
});

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const checkIfLoggedIn = async function () {
    const token = await api.get("/auth/status");
    console.log(token.data.userID);
    if (token.data.userID === "") {
      setToken("");
    } else {
      setToken(token.data);
      console.log(location.pathname);
      const origin = location.pathname || "/";
      navigate(origin);
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const handleLogin = async function (username, password) {
    try {
      const token = await api.post("/login", {
        username: username,
        password: password,
      });
      setToken(token.data);
      navigate("/");
    } catch (error) {
      console.log(error || "login failed");
    }
  };

  const handleLogout = async function () {
    const res = await api.post("/logout");
    console.log(res.data);
    setToken("");
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
