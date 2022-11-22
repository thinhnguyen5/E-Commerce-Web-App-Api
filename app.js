const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 80;

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Import ROUTES
const productsRoute = require('./routes/products');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');

app.use('/products', productsRoute);
app.use("/auth", authRoute)
app.use("/user", userRoute);

app.get('/', (req, res) => {
    res.send("E-Commerce API - Thesis Project - DIN19SP")
})

//Connect to DB
mongoose.connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true },
    () => console.log('Connecting to DB')
);

//Listening the server
// Listen on port 4000
app.listen(port, () => console.log(`Listening on port ${port}`))