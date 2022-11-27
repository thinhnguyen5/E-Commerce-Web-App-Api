const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const {registerValidation, loginValidation} = require('../validation');

//REGISTER
router.post('/register', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE CREATE ACCOUNT
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the database
    const usernameExists = await User.findOne({username: req.body.username});
    if(usernameExists) return res.status(400).send('Username already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.passwordHash, salt);

    try {
        //Create a new user
        const user = new User({
            username: req.body.username,
            name: req.body.name,
            passwordHash: hashedPassword,
        });
        const accessToken = jwt.sign({userId: user._id}, process.env.SECRET, {
            expiresIn: '1d'
        });
        user.accessToken = accessToken;
        const savedUser = await user.save();
        res.status(201).json({
            user: savedUser,
            message: "You have signed up successfully"
        });
    } catch (err){
            res.status(400).send(err);
        }
    });


//LOGIN
router.post("/login", async (req, res) => {
  const { username, passwordHash } = req.body;

  const user = await User.findOne({ username });
    if (!user) {
      return res.json({ error: "User Not found" });
    }
    if (await bcrypt.compare(passwordHash, user.passwordHash)) {
      const accessToken = jwt.sign({ username: user.username }, process.env.SECRET);

      if (res.status(201)) {
        return res.json({ status: "ok", data: accessToken });
      } else {
        return res.json({ error: "error" });
      }
    }
    res.json({ status: "error", error: "InvAlid Password" });
    });

//USER DATA
router.post("/userData", async(req, res) => {
  const {accessToken} = req.body;
  try {
    const user = jwt.verify(accessToken, process.env.SECRET);
    const username = user.username;
    User.findOne({ username: username }).then((data) => {
      res.send({ status: "Ok", data: data });
    }).catch((error) => {
      res.send({ status: "Error", data: error });
    });
  } catch (error) {}
})

module.exports = router;