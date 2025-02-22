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
  const { onLogin } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
export default Login;
