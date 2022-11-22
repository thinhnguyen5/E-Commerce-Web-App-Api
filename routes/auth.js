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
router.post('/login', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE LOGIN
    const{ error } = loginValidation(req.body);
    if (error)  return res.status(400).send(error.details[0].message);
    
    //Checking if the user is already in the database
    const user = await User.findOne({username: req.body.username});
    if(!user) return res.status(400).send('username is not valid');
    
    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.passwordHash, user.passwordHash);
    if(!validPass) return res.status(400).send('Invalid password');

    //Create and assign a token 
    const accessToken = jwt.sign({userId: user._id}, process.env.SECRET, {
        expiresIn: '1d'
    });
    await User.findByIdAndUpdate(user._id, {accessToken})
    res.status(200).json({
        user: {username: user.username},
        accessToken
    });    
});

module.exports = router;