import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx";

import deleteIcon from "../assets/delete-button.svg";
import "../App.css";
import api from "../api.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-left">{author}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <Button
              onClick={(e) => {
                deleteNote();
              }}
            >
              Delete
            </Button>
            <p>{text}</p>
            <p>
              {timestamp} <br></br>id: {id}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-left">{author}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <p>{text}</p>
            <p>
              {timestamp} <br></br>id: {id}
            </p>
          </div>
        </CardContent>
      </Card>
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
      <Textarea
        value={noteInput}
        onChange={(e) => {
          setNoteInput(e.target.value);
        }}
      />
      <Button
        onClick={(e) => {
          postNote(noteInput);
        }}
      >
        Send Note
      </Button>
    </div>
  );
}

export default Home;
