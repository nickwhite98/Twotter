import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx";

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
  const { token } = useContext(AuthContext);
  const userID = token.userID;
  const username = token.username;
  const [notes, setNotes] = useState([]);
  const fetchNotes = async function () {
    const notesData = await api.get("/notes");
    setNotes(notesData.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <div className="main-content">
        <NoteInput fetchNotes={fetchNotes}></NoteInput>

        <div>
          {notes &&
            notes
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
      </div>
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
