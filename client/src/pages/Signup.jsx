import { useState, useEffect, useContext } from "react";
import api from "../api.jsx";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setreEnterPassword] = useState("");
  const [userAvailableMsg, setUserAvailableMsg] = useState("");
  const [isUserAvailable, setIsUserAvailable] = useState("");

  useEffect(() => {
    if (!username) {
      setUserAvailableMsg("");
      return;
    } // don't check empty username input

    const delay = setTimeout(() => {
      checkUsernameAvailable(username); //Call API after delay
    }, 500);

    return () => clearTimeout(delay); // clear timer if user keeps typing
  }, [username]);

  const handleSubmit = async function (e) {
    e.preventDefault();
    if (password !== reEnterPassword || password === "") {
      alert("Passwords do not match, please try again");
      setPassword("");
      setreEnterPassword("");
    } else if (!isUserAvailable) {
      alert("Username is not available");
    } else {
      const response = await api.post("/user", {
        username: username,
        password: password,
      });
    }
  };
  const checkUsernameAvailable = async function () {
    console.log(`I checked ${username}`);
    const response = await api.post("/userexist", {
      username: username,
    });
    if (response.data.userExist) {
      setUserAvailableMsg(`Username: ${username} is not available`);
      setIsUserAvailable(false);
      console.log("user isn't allowed", isUserAvailable);
    } else {
      setUserAvailableMsg(`Username: ${username} is Available!`);
      setIsUserAvailable(true);
    }
    console.log(response.data.userExist);
  };

  return (
    <>
      <h1>Create Account (PUBLIC)</h1>
      <form onSubmit={handleSubmit}>
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
          <p>{userAvailableMsg}</p>
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
