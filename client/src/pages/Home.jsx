import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx";
import { MoreVertical } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [open, setOpen] = useState(false);

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
    console.log(response.data);
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
        <ParentCommentInput
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
          {replies.length !== 0 && (
            <Collapsible>
              <CollapsibleTrigger
                onClick={() => {
                  setOpen(!open);
                }}
              >
                {open ? <ChevronUp /> : <ChevronDown />}
              </CollapsibleTrigger>
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
                        fetchReplies={fetchReplies}
                      />
                    );
                  })}
              </CollapsibleContent>
            </Collapsible>
          )}
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
  const parentNoteID = props.parentNoteID;
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [childComments, setChildComments] = useState([]);

  const fetchChildComments = async function () {
    const response = await api.get(`/child_comments/${id}`);
    setChildComments(response.data);
  };

  useEffect(() => {
    fetchChildComments();
  }, []);

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
                reply
              </Button>
            </div>
          </div>
        </CardContent>
        {childComments &&
          childComments.map((childComment) => {
            return (
              <Comment
                key={childComment.id}
                id={childComment.id}
                text={childComment.text}
                timestamp={childComment.timestamp}
                author={childComment.username}
                authorID={childComment.user_id}
                parentNoteID={childComment.parent_note_id}
                parentReplyID={childComment.parent_reply_id}
              />
            );
          })}
      </Card>

      {showReplyInput && (
        <ChildCommentInput
          parentComment={{ parentCommentID: id, parentNoteID: parentNoteID }}
          fetchChildComments={fetchChildComments}
          setShowReplyInput={setShowReplyInput}
        />
      )}
    </div>
  );
}

function ChildCommentInput(props) {
  const [replyInput, setReplyInput] = useState("");
  const fetchChildComments = props.fetchChildComments;
  const parentCommentID = props.parentComment.parentCommentID;
  const parentNoteID = props.parentComment.parentNoteID;
  const setShowReplyInput = props.setShowReplyInput;

  const postComment = async function () {
    const response = await api.post("/reply", {
      data: {
        parentNoteID: parentNoteID,
        text: replyInput,
        parentCommentID: parentCommentID,
      },
    });

    setReplyInput("");
    setShowReplyInput(false);
    fetchChildComments();
  };

  return (
    <Card>
      <CardHeader className="!flex-row !space-y-0 items-center justify-between p-6">
        <CardTitle className="text-l text-left">Replying</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          <Textarea
            value={replyInput}
            onChange={(e) => {
              setReplyInput(e.target.value);
            }}
          />
          <div className="flex justify-end">
            <Button onClick={() => postComment()}>send</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ParentCommentInput(props) {
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
        parentCommentID: null,
      },
    });
    setReplyInput("");
    fetchReplies();
  };

  return (
    <Drawer>
      <DrawerTrigger>Reply</DrawerTrigger>

      <DrawerContent>
        <DrawerTitle>Reply</DrawerTitle>
        <DrawerDescription></DrawerDescription>

        <DrawerHeader className="flex flex-col items-center justify-center">
          <Textarea
            value={replyInput}
            onChange={(e) => {
              setReplyInput(e.target.value);
            }}
          />
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose
            onClick={(e) => {
              postReply();
            }}
          >
            Send
          </DrawerClose>
          <DrawerClose>Cancel</DrawerClose>
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
