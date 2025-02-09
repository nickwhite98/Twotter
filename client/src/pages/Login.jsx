import { useState, useEffect, useContext } from "react";
import api from "../api.jsx";
import {
  BrowserRouter as Router,
  Routes,
  useNavigate,
  Route,
  Link,
} from "react-router-dom";
import { AuthContext } from "../AuthProvider.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin } = useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <>
      <h1>Login (PUBLIC)</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
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

// }
// function LoginOLD({ onLogin }) {

//   const navigate = useNavigate();

//   };

//   return (

//   );
// }
