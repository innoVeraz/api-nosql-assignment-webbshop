const express = require("express");
const router = express.Router();
const userModel = require("../models/user");

// KOD FÖR GODKÄNT

//HÄMTA ALLA USERS
router.get("/", async (req, res) => {
  const dbUsers = await userModel.find();

  const users = dbUsers.map((user) => {
    return {
      _id: user._id,
      name: user.name,
      emil: user.email,
    };
  });

  res.send(users);
});

//HÄMTA SPEC. USER
router.post("/", async (req, res) => {
  const user = await userModel.findOne({ _id: req.body.id });
  res.send(user);
});

//SKAPA USER
router.post("/add", async (req, res) => {
  const user = await userModel.create(req.body);
  res.send(user);
});

//LOGGA IN USER
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const dbUser = await userModel.findOne({ email });

  //om användaren inte finns svara med 400
  if (!dbUser) {
    return res.sendStatus(400);
  }
  if (password !== dbUser.password) {
    return res.sendStatus(400);
  }
  res.send("Du är inloggad!");
});
module.exports = router;
