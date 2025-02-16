import { useState, useEffect, useContext } from "react";

import {
  BrowserRouter as Router,
  Routes,
  useNavigate,
  Route,
  Link,
} from "react-router-dom";
import { AuthContext } from "../AuthProvider.jsx";

function Login() {
  const { token } = useContext(AuthContext);
  const [loginFailMsg, setLoginFailMsg] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginResult = await onLogin(username, password);
    if (!loginResult) {
      setLoginFailMsg(
        "Login attempt failed, please check username and password and try again"
      );
    }
  };

  return (
    <>
      <h1>Login (PUBLIC)</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <p style={{ color: "red" }}>{loginFailMsg}</p>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            onFocus={(e) => (e.target.placeholder = "")} // Clears placeholder on focus
            onBlur={(e) => (e.target.placeholder = "Username")}
            placeholder="Username"
          />
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onFocus={(e) => (e.target.placeholder = "")} // Clears placeholder on focus
            onBlur={(e) => (e.target.placeholder = "Password")}
            placeholder="Password"
          />
        </div>
        <button type="submit">Sign in</button>
      </form>
    </>
  );
}
export default Login;
