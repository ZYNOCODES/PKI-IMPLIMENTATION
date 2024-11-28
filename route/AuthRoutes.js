const express = require('express');
const router = express.Router();
const {
    login,
    register
} = require('../controller/AuthController.js');
const limiter = require('../middleware/RateLimiting.js');
const pkiMiddleware = require("../middleware/pkiMiddleware");

//ROUTE
router.post("/login", limiter, pkiMiddleware, login);
router.post("/register", limiter, pkiMiddleware, register);

module.exports = router;