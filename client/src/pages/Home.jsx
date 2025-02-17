import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx";

import deleteIcon from "../assets/delete-button.svg";
import "../App.css";
import api from "../api.jsx";

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
                    author={note.username}
                    authorID={note.user_id}
                    currentUser={username}
                  ></Note>
                );
              })}
        </div>
      </div>
    </>
  );
}

function Note(props) {
  const fetchNotes = props.fetchNotes;
  const id = props.id;
  const text = props.text;
  const timestamp = props.timestamp;
  const author = props.author;
  const authorID = props.authorID;
  const currentUser = props.currentUser;

  const deleteNote = async function () {
    const response = await api.delete("/note", {
      data: { noteID: id, authorID: authorID },
    });
    if (response.data.error) console.log(response.data.error);
    console.log(response.data.success);
    fetchNotes();
  };

  if (currentUser === author) {
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
        <h3>{author} Says:</h3>

        <p>{text}</p>
        <p>
          {timestamp} <br></br>id: {id}
        </p>
      </div>
    );
  } else {
    return (
      <div className="note">
        <h3>{author} Says:</h3>

        <p>{text}</p>
        <p>
          {timestamp} <br></br>id: {id}
        </p>
      </div>
    );
  }
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
