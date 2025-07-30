const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({
  origin: 'https://gatsby-backend-1.onrender.com/',
  credentials: true
}));

app.use(bodyParser.json());

app.use(session({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true in production (HTTPS)
}));

const users = [
  { id: 1, username: "admin", password: "password" }
];

// Login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    res.send({ loggedIn: true, user });
  } else {
    res.status(401).send({ message: "Invalid credentials" });
  }
});

// Check session
app.get("/api/session", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

// Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.send({ loggedOut: true });
  });
});

app.listen(5000, () => {
  console.log("Auth server running on http://localhost:5000");
});
