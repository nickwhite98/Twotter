import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx";
import "../App.css";
import api from "../api.jsx";
import { useParams } from "react-router-dom";

function Account() {
  const { token } = useContext(AuthContext);
  const { username } = useParams();
  const { onLogout } = useContext(AuthContext);

  return (
    <>
      <h1>User Page for {username}</h1>
      <button type="button" onClick={onLogout}>
        Sign Out
      </button>
    </>
  );
}

export default Account;
