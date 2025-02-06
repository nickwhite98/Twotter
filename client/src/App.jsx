import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import deleteIcon from "./assets/delete-button.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import api from "./api.jsx";

function App() {
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
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <Logout></Logout>
      <Login></Login>
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

function Login(props) {
  const [userInput, setUserInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const postLogin = async function (username, password) {
    try {
      const response = await api.post("/login", {
        username: username,
        password: password,
      });
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

export default App;
