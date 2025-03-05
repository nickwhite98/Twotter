import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx";
import { MoreVertical } from "lucide-react";
import "../App.css";
import api from "../api.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
                    key={note.id}
                    id={note.id}
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

  return (
    <Card>
      <CardHeader className="!flex-row !space-y-0 items-center justify-between p-6">
        <CardTitle className="text-2xl text-left">{author}</CardTitle>

        {currentUser === author && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link
                  to={`/account/${currentUser}`}
                  className="w-full no-underline text-inherit"
                >
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  deleteNote();
                }}
              >
                Delete Note
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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
      <Drawer>
        <DrawerTrigger>Create Post</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <Textarea
              value={noteInput}
              onChange={(e) => {
                setNoteInput(e.target.value);
              }}
            />
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button
                onClick={(e) => {
                  postNote(noteInput);
                }}
              >
                Send Note
              </Button>
            </DrawerClose>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default Home;
