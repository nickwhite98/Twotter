import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import deleteIcon from "./assets/delete-button.svg";
import viteLogo from "/vite.svg";
import axios from "axios";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const fetchNotes = async function () {
    const notesData = await axios.get("http://localhost:3000/api/v1/notes");
    setNotes(notesData.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Twitter Two</h1>
      <NoteInput fetchNotes={fetchNotes}></NoteInput>

      <div>
        {notes
          .slice()
          .reverse()
          .map((note) => {
            return (
              <Note
                fetchNotes={fetchNotes}
                key={note.id}
                id={note.id}
                text={note.text}
                timestamp={note.timestamp}
                user={note.user}
              ></Note>
            );
          })}
      </div>
      <p className="read-the-docs"></p>
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
    const response = await axios.delete("http://localhost:3000/api/v1", {
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
    const response = await axios.post("http://localhost:3000/api/v1/note", {
      text: noteInput,
    });
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

export default App;
