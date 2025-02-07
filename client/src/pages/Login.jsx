import { useState, useEffect } from "react";
import api from "../api.jsx";
import {
  BrowserRouter as Router,
  Routes,
  useNavigate,
  Route,
  Link,
} from "react-router-dom";

function LoginPage() {
  return (
    <>
      <h1>Login</h1>
      <Login></Login>
    </>
  );
}

function Login(props) {
  const [userInput, setUserInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const navigate = useNavigate();
  const postLogin = async function (username, password) {
    try {
      const response = await api.post("/login", {
        username: username,
        password: password,
      });
      console.log(response.data.message);
      if (response.data.message) navigate("/");
    } catch (error) {
      console.log(error.response?.data?.error || "login failed");
    }
  };

  return (
    <div>
      <input
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
        }}
      />
      <input
        value={passInput}
        onChange={(e) => {
          setPassInput(e.target.value);
        }}
      />
      <button
        onClick={(e) => {
          postLogin(userInput, passInput);
        }}
      >
        Login
      </button>
    </div>
  );
}

export default LoginPage;
