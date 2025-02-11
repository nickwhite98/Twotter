import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx";
import "../App.css";
import api from "../api.jsx";
import { useParams } from "react-router-dom";

function Account() {
  const { token } = useContext(AuthContext);
  const { username } = useParams();
  return (
    <>
      <h1>User Page for {username}</h1>
    </>
  );
}

export default Account;
