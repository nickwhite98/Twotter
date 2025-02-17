require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

// Change structure to pass session value back and forth on cookies instead of userID
// Change login checks to query DB for session and find userID

const generateToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};

//Only need CORS in Development, Prod has same origin
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: "http://3.16.68.73:3000",
      credentials: true,
    })
  );
}
app.use(express.json());
app.use(cookieParser());
//could use middleware to make the check logged in shit easier

const db = new sqlite3.Database("./datafuckshack.db");

//create users table
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    username TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL
  )`
);
//Create notes table
db.run(
  "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, text TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id) )"
);

const getLoggedInUserID = async function (req) {
  const token = req.cookies.token;
  const result = await new Promise((resolve, reject) => {
    db.get("SELECT id FROM users WHERE token=(?)", [token], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(row.id);
      } else {
        resolve(null); //no user
      }
    });
  });
  return result;
};

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
      "SELECT password, token FROM users WHERE username=(?)",
      [username],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve({ password: row.password, token: row.token });
        } else {
          resolve(null); //no user
        }
      }
    );
  });
  return result;
};

//CHECK IF USER LOGGED IN
app.get("/api/v1/auth/status", async (req, res) => {
  const userID = await getLoggedInUserID(req);

  if (userID !== null) {
    const username = await new Promise((resolve, reject) => {
      db.get(
        "SELECT username FROM users WHERE id=(?)",
        [userID],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row.username);
          }
        }
      );
    });

    res.json({
      message: "Logged in successfully",
      userID: userID,
      username: username,
    });
  } else {
    res.json({ message: "not logged on", userID: "" });
  }
});

//LOGIN
app.post("/api/v1/login", async function (req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const userData = await getPassword(username);
    if (userData === null) {
      res.status(400).json({ error: "No user" });
      return;
    }
    const storedPassword = userData?.password;
    const userID = userData.id;
    const token = userData.token;

    if (password === storedPassword) {
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? false : true,
        sameSite: process.env.NODE_ENV === "production" ? "Lax" : "None",
      });
      res.json({
        message: "Logged in successfully",
        userID: userID,
        username: username,
      });
    } else {
      res.status(400).json({ error: "Wrong password" });
    }
  } catch (error) {
    console.log("login error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//LOGOUT
app.post("/api/v1/logout", async function (req, res) {
  //check if user logged in
  const userID = await getLoggedInUserID(req);
  if (userID !== null) {
    //if logged in (check cookie), destroy the cookie!!!
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? false : true,
      sameSite: process.env.NODE_ENV === "production" ? "Lax" : "None",
      path: "/",
    });
    //return message/status - you've logged out
    res.send("Logged out successfully");
  } else {
    //do nothing if not logged in
    return;
  }
});

//CREATE USER
app.post("/api/v1/user", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const token = generateToken();
  //inserting plaintext password is BAD
  db.run(
    "INSERT INTO users (username, password, token) VALUES (?, ?, ?)",
    [username, password, token],
    function (err) {
      if (err) {
        res.status(400).json({ error: err });
        console.log(err);
        return;
      }
      res.status(201).json({ success: "user has entered the shack 😍" });
    }
  );
});

//CHECK IF USER EXISTS
app.post("/api/v1/userexist", async function (req, res) {
  const username = req.body.username;
  const result = await new Promise((resolve, reject) => {
    db.get(
      "SELECT username FROM users WHERE username=(?)",
      [username],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
  res.status(200).json({ userExist: result });
});

//GETS ALL NOTES
app.get("/api/v1/notes", async function (req, res) {
  const userID = await getLoggedInUserID(req);
  if (userID !== null) {
    try {
      const data = await getNotes(db);
      res.send(data);
    } catch (error) {
      res.status(500).send("error fetching data");
    }
  } else {
    res.status(400).send("Not logged in!");
  }
});

//POSTS NEW NOTE
app.post("/api/v1/note", async (req, res) => {
  const userID = await getLoggedInUserID(req);

  if (userID !== null) {
    const noteText = req.body.text;
    if (!noteText) {
      res.status(400).json({ error: "Text field is required" });
      return;
    }
    insertNote(db, noteText, userID);
    res.status(201).json({ success: "Note entered to DB" });
  } else {
    res.status(400).send("Not logged in!");
  }
});

//DELETES NOTE
app.delete("/api/v1/note", async (req, res) => {
  const currentUserID = await getLoggedInUserID(req);

  if (currentUserID !== null) {
    const noteID = req.body.noteID;
    db.run(
      "DELETE FROM notes WHERE id= ? AND user_id = ?",
      [noteID, currentUserID],
      function (err) {
        if (err) res.status(500).json({ error: "Database error! Oh no!" });
        if (this.changes === 0) {
          res
            .status(400)
            .json({ error: "No record found with that id, nothing happened" });
        } else {
          res.status(202).json({ success: `Note deleted with id ${noteID}` });
        }
      }
    );
  } else {
    res.status(400).send("Not logged in!");
  }
});

if (process.env.NODE_ENV === "production") {
  //serve React frontend
  app.use(express.static(path.join(__dirname, "public")));

  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      // Let the request be handled by other routes
      return next();
    }
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

app.listen(3000, () => {
  console.log("server listening on port http://localhost:3000");
});
