const express = require('express');
const app = express();
const db = require('./db');
const cors = require('cors');
const AuthController = require('./controller/authController');
const port = process.env.PORT || 1200;

app.use(cors());
app.use('/api/auth', AuthController);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});