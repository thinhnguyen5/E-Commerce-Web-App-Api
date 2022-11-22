const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get ('/', async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
        data: users
    });
});

router.get ('/:userId', async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) return next(new Error('User does not exist'));
        res.status(200).json({
            data: user
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch ('/:userId', async (req, res, next) => {
    try {
        const update = req.body
        const userId = req.params.userId;
        await User.findByIdAndUpdate(userId, update);
        const user = await User.findById(userId)
        res.status(200).json({
            data: user,
            message: 'User has been updated'
        });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete ('/:userId', async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            data: null,
            message: 'User has been deleted'
        });
    } catch (error) {
        res.status(400).send(error);
    }
});


module.exports = router;