import { useState, useEffect } from "react";
import flappy from "../assets/flappy.png";
import deleteIcon from "../assets/delete-button.svg";
import "../App.css";
import api from "../api.jsx";
import {
  BrowserRouter as Router,
  Routes,
  useNavigate,
  Route,
  Link,
} from "react-router-dom";

function Home() {
  const [notes, setNotes] = useState([]);
  const fetchNotes = async function () {
    const notesData = await api.get("/notes");
    setNotes(notesData.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  const fetchLoginState = async function () {
    const response = await api.get("/auth/status");
    setIsAuthenticated(response.data.status);
  };

  useEffect(() => {
    fetchLoginState();
  }, []);

  if (isAuthenticated !== null && !isAuthenticated) {
    navigate("/login");
  }

  return (
    <>
      <div>
        <h1>Two-tter</h1>
        <a
          href="https://github.com/nickwhite98?tab=repositories"
          target="_blank"
        >
          <img src={flappy} className="logo spinning-logo" alt="Twotter logo" />
        </a>
      </div>
      <Logout></Logout>
      <Link to="/Login">Login</Link>
      <NoteInput fetchNotes={fetchNotes}></NoteInput>

      <div>
        {notes
          .slice()
          .reverse()
          .map((note) => {
            return (
              <Note
                fetchNotes={fetchNotes}
                key={note.note_id}
                id={note.note_id}
                text={note.text}
                timestamp={note.timestamp}
                user={note.username}
              ></Note>
            );
          })}
      </div>
      <p className="read-the-docs"></p>
    </>
  );
}

function Logout() {
  return (
    <>
      <button
        onClick={async function () {
          const res = await api.post("/logout");
          console.log(res.data);
        }}
      >
        Log out dog
      </button>
    </>
  );
}

function Note(props) {
  const fetchNotes = props.fetchNotes;
  const id = props.id;
  const text = props.text;
  const timestamp = props.timestamp;
  const user = props.user;

  const deleteNote = async function () {
    const response = await api.delete("/note", {
      data: { noteID: id },
    });
    if (response.data.error) console.log(response.data.error);
    console.log(response.data.success);
    fetchNotes();
  };

  return (
    <div className="note">
      <button
        className="delete-button"
        onClick={(e) => {
          deleteNote();
        }}
      >
        <img
          src={deleteIcon}
          className={"filter-white" + " " + "delete-icon"}
        ></img>
      </button>
      <h3>{user} Says:</h3>

      <p>{text}</p>
      <p>
        {timestamp} <br></br>id: {id}
      </p>
    </div>
  );
}

function NoteInput(props) {
  const fetchNotes = props.fetchNotes;
  const [noteInput, setNoteInput] = useState("");
  const postNote = async function (text) {
    const response = await api.post(
      "/note",
      {
        text: noteInput,
      },
      { withCredentials: true, sameSite: "None" }
    );
    if (response.data.error) console.log(response.data.error);
    setNoteInput("");
    fetchNotes();
  };

  return (
    <div>
      <textarea
        value={noteInput}
        onChange={(e) => {
          setNoteInput(e.target.value);
        }}
      />
      <button
        onClick={(e) => {
          postNote(noteInput);
        }}
      >
        Send Note
      </button>
    </div>
  );
}

export default Home;
