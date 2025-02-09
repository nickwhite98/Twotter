import { useState, useEffect, useContext } from "react";
import api from "../api.jsx";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setreEnterPassword] = useState("");
  const [userAvailable, setUserAvailable] = useState("OG");

  useEffect(() => {
    if (!username) {
      setUserAvailable("");
      return;
    } // don't check empty username input

    const delay = setTimeout(() => {
      checkUsernameAvailable(username); //Call API after delay
    }, 500);

    return () => clearTimeout(delay); // clear timer if user keeps typing
  }, [username]);

  const handleSubmit = async function (e) {
    e.preventDefault();
    if (password === reEnterPassword) {
      const response = await api.post("/user", {
        username: username,
        password: password,
      });
    } else {
      alert("Passwords do not match, please try again");
      setPassword("");
      setreEnterPassword("");
    }
  };

  const checkUsernameAvailable = async function () {
    console.log(`I checked ${username}`);
    const response = await api.post("/userexist", {
      username: username,
    });
    if (response.data.userExist) {
      setUserAvailable(`Username: ${username} is not available`);
    } else {
      setUserAvailable(`Username: ${username} is Available!`);
    }
    console.log(response.data.userExist);
  };

  return (
    <>
      <h1>Create Account (PUBLIC)</h1>
      <form onSubmit={checkUsernameAvailable}>
        <div>
          <input
            type=""
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            onFocus={(e) => (e.target.placeholder = "")} // Clears placeholder on focus
            onBlur={(e) => (e.target.placeholder = "Username")}
            placeholder="Username"
          />
          <p>{userAvailable}</p>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Password")}
            placeholder="Password"
          />
          <input
            value={reEnterPassword}
            onChange={(e) => {
              setreEnterPassword(e.target.value);
            }}
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Re-enter Password")}
            placeholder="Re-enter Password"
          />
        </div>
        <button type="submit">Create Account</button>
      </form>
    </>
  );
}

export { SignUp };
