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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin } = useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <>
      <h1>Login (PUBLIC)</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type="submit">Sign in</button>
      </form>
    </>
  );
}
export default Login;
