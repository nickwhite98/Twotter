const express = require("express");
const session = require("express-session");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

// API Endpoints - User create
// Log in
// Log out
// UI For all dat
// check existing endpoints, only allow if logged in

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const db = new sqlite3.Database("./datafuckshack.db");

//create users table
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    username TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL
  )`
);
//Create notes table
db.run(
  "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, text TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id) )"
);

const insertNote = function (db, text, userID) {
  console.log(userID);
  db.run(
    "INSERT INTO notes (text, user_id) VALUES (?, ?)",
    [text, userID],
    function (err) {
      if (err) return console.error(err.message);
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
  );
};

const getNotes = async function (db) {
  const result = await new Promise((resolve, reject) => {
    db.all(
      "SELECT notes.id AS note_id, notes.text, notes.timestamp, notes.user_id, users.id AS user_id, users.username FROM notes JOIN users ON notes.user_id = users.id",
      [],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
  return result;
};

const getPassword = async function (username) {
  const result = await new Promise((resolve, reject) => {
    db.get(
      "SELECT password, id FROM users WHERE username=(?)",
      [username],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve({ password: row.password, id: row.id });
        } else {
          resolve(null); //no user
        }
      }
    );
  });
  return result;
};

//post req -
app.post("/api/v1/login", async function (req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const userData = await getPassword(username);
    const storedPassword = userData.password;
    const userID = userData.id;

    if (password === storedPassword) {
      res.cookie("userID", userID, { httpOnly: true, sameSite: "None" });
      res.json({ message: "Logged in successfully", userID: userID });
    } else {
      res.status(400).json({ error: "Wrong password" });
    }
  } catch (error) {
    console.log("login error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/v1/logout", async function (req, res) {
  //check if user logged in
  const user_id = req.cookies.userID;
  if (user_id) {
    //if logged in (check cookie), destroy the cookie!!!
    res.clearCookie("userID", { path: "/" });
    //return message/status - you've logged out
    res.send("Logged out successfully");
  } else {
    //do nothing if not logged in
    return;
  }
});

app.get("/", (req, res) => {
  res.send("HELLO!!!!");
});

app.post("/api/v1/user", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  //inserting plaintext password is BAD
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    function (err) {
      if (err) {
        res.status(400).json({ error: err });
        return;
      }
      res.status(201).json({ success: "user has entered the shack 😍" });
    }
  );
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
  const userID = req.cookies.userID;
  if (!noteText) {
    res.status(400).json({ error: "Text field is required" });
    return;
  }
  insertNote(db, noteText, userID);
  res.status(201).json({ success: "Note entered to DB" });
});

app.delete("/api/v1/note", (req, res) => {
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
