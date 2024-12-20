require('dotenv').config();

const express = require('express');
const path = require('path');
const sequelize = require('./config/Database');
//error handler
const ErrorHandler = require('./controller/ErrorController.js');
//security
const cors = require('cors');
const removeSpacesMiddleware = require('./middleware/RemoveSpacesMiddleware.js');
const { generateKeyPair } = require("./util/pki.js");

//routes
const AuthRoutes = require('./route/AuthRoutes');

//http server
const http = require('http');
const port = process.env.PORT || 8080;

//express app
const app = express();
const server = http.createServer(app);

//midlewares
//cors
app.use(cors());
//static files
app.use('/files', express.static('./files'));
//body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));
//remove spaces from request
app.use(removeSpacesMiddleware);
// Generate keys at startup
generateKeyPair();

//routes
app.use('/api/auth', AuthRoutes);

//error handling
app.use(ErrorHandler);

//client static files
app.use(express.static("./public/dist"));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public","dist", "index.html"));
});

// Disable logging of SQL queries
sequelize.options.logging = false;
//connect to db
sequelize.sync().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error('Database connection error:', error);
});