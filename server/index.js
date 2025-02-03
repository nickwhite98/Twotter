const express = require("express");
const session = require("express-session");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173",
};

// Redo data schema - users table, usename, password, user ID
// Modified version of existing notes table - foreign key to connect user to note
// API Endpoints - User create
// Log in
// Log out
// UI For all dat
// check existing endpoints, only allow if logged in

app.use(cors(corsOptions));
app.use(express.json());

const db = new sqlite3.Database("./notes.db");

//Create notes table
db.run(
  "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, text TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, user TEXT)"
);

//

const insertNote = function (db, note) {
  const text = note.text;
  const user = note.user;

  db.run(
    "INSERT INTO notes (text, user) VALUES (?, ?)",
    [text, user],
    function (err) {
      if (err) return console.error(err.message);
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
  );
};

const getNotes = async function (db) {
  const result = await new Promise((resolve, reject) => {
    db.all("SELECT * FROM notes", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
  return result;
};

class Note {
  constructor(text, user) {
    this.text = text;
    this.user = user;
  }
}

//update to take user (once we get there)
const makeNote = function (text) {
  return new Note(text, "Nick");
};

app.get("/", (req, res) => {
  res.send("HELLO!!!!");
});

app.get("/api/v1/notes", async function (req, res) {
  try {
    const data = await getNotes(db);
    res.send(data);
  } catch (error) {
    res.status(500).send("error fetching data");
  }
});

app.post("/api/v1/note", (req, res) => {
  const noteText = req.body.text;
  const note = makeNote(noteText);
  if (!noteText) {
    res.status(400).json({ error: "Text field is required" });
    return;
  }
  insertNote(db, note);
  res.status(201).json({ success: "Note entered to DB" });
});

app.delete("/api/v1/", (req, res) => {
  const noteID = req.body.noteID;
  db.run("DELETE FROM notes WHERE id= (?)", [noteID], function (err) {
    if (err) res.status(500).json({ error: "Database error! Oh no!" });
    if (this.changes === 0) {
      res
        .status(500)
        .json({ error: "No record found with that id, nothing happened" });
    }
    res.status(202).json({ success: `Note deleted with id ${noteID}` });
  });
});

app.listen(3000, () => {
  console.log("server listening on port http://localhost:3000");
});
