import { useState, useEffect, useContext } from "react";
import { LoginForm } from "@/components/login-form";

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

  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
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
