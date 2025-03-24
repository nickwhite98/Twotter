import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx";
import { MoreVertical } from "lucide-react";
import AvatarManager from "../components/AvatarManager.jsx";
import "../App.css";
import api from "../api.jsx";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const timestamp = format(new Date(props.timestamp), "MMM d, h:mm a");
  const author = props.author;
  const authorID = props.authorID;
  const currentUser = props.currentUser;

  const { token } = useContext(AuthContext);
  const userID = token.userID;
  const username = token.username;

  const [replies, setReplies] = useState([]);

  const deleteNote = async function () {
    const response = await api.delete("/note", {
      data: { noteID: id, authorID: authorID },
    });
    if (response.data.error) console.log(response.data.error);
    console.log(response.data.success);
    fetchNotes();
  };

  const fetchReplies = async function () {
    const response = await api.get(`/replies/${id}`);
    setReplies(response.data);
  };

  useEffect(() => {
    fetchReplies();
  }, []);

  return (
    <Card>
      <CardHeader className="!flex-row !space-y-0 items-center justify-between p-6">
        {authorID && <AvatarManager userID={authorID} />}
        <CardTitle className="text-2xl text-left">{author}</CardTitle>

        {/*Reply Button */}
        <ParentReplyInput
          fetchReplies={fetchReplies}
          parentNote={{ id, text, timestamp, author, authorID }}
        />

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
          <p className="break-words overflow-hidden">{text}</p>
          <p>{timestamp}</p>
          <Collapsible>
            <CollapsibleTrigger>Comments</CollapsibleTrigger>
            <CollapsibleContent>
              {replies &&
                replies.map((reply) => {
                  return (
                    <Comment
                      key={reply.id}
                      id={reply.id}
                      text={reply.text}
                      timestamp={reply.timestamp}
                      author={reply.username}
                      authorID={reply.user_id}
                      parentNoteID={reply.parent_note_id}
                      parentReplyID={reply.parent_reply_id}
                    />
                  );
                })}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}

function Comment(props) {
  const id = props.id;
  const text = props.text;
  const timestamp = props.timestamp;
  const author = props.author;
  const authorID = props.authorID;
  const currentUser = props.currentUser;
  const parentReplyID = props.parentReplyID;
  const parentNoteID = props.parentNoteID;
  const [showReplyInput, setShowReplyInput] = useState(false);

  return (
    <div>
      <Card>
        <CardHeader className="!flex-row !space-y-0 items-center justify-between p-6">
          {authorID && <AvatarManager userID={authorID} />}
          <CardTitle className="text-2xl text-left">{author}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            <p className="break-words overflow-hidden">{text}</p>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (showReplyInput) {
                    setShowReplyInput(false);
                  } else {
                    setShowReplyInput(true);
                  }
                }}
              >
                Reply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {showReplyInput && <ChildCommentInput />}
    </div>
  );
}

function ChildCommentInput(props) {
  const [replyInput, setReplyInput] = useState("");
  // const parentNoteID = props.parentNoteID;
  // const parentReplyID = props.parentNo.id;
  // const parentText = props.parentNote.text;
  // const parentTimestamp = props.parentNote.timestamp;
  // const parentAuthor = props.parentNote.author;
  // const parentAuthorID = props.parentNote.authorID;

  return (
    <Card>
      <CardHeader className="!flex-row !space-y-0 items-center justify-between p-6">
        <CardTitle className="text-l text-left">Replying</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          <Textarea />
          <div className="flex justify-end">
            <Button>send</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ParentReplyInput(props) {
  const [replyInput, setReplyInput] = useState("");
  const fetchReplies = props.fetchReplies;
  const parentNoteID = props.parentNote.id;
  const parentText = props.parentNote.text;
  const parentTimestamp = props.parentNote.timestamp;
  const parentAuthor = props.parentNote.author;
  const parentAuthorID = props.parentNote.authorID;

  const postReply = async function () {
    const response = await api.post("/reply", {
      data: {
        parentNoteID: parentNoteID,
        text: replyInput,
        parentReplyID: parentReplyID,
      },
    });

    setReplyInput("");
    fetchReplies();
  };

  return (
    <Drawer>
      <DrawerTrigger>Reply</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-col items-center justify-center">
          <Textarea
            value={replyInput}
            onChange={(e) => {
              setReplyInput(e.target.value);
            }}
          />
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>
            <Button
              onClick={(e) => {
                postReply();
              }}
            >
              Send
            </Button>
          </DrawerClose>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
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
