const express = require('express');
const router = express.Router();
const {
    login,
    register,
    getPrivateKey
} = require('../controller/AuthController.js');
const limiter = require('../middleware/RateLimiting.js');
const pkiMiddleware = require("../middleware/pkiMiddleware");

//ROUTE
router.post("/login", limiter, pkiMiddleware, login);
router.post("/register", limiter, pkiMiddleware, register);
router.get("/private-key", getPrivateKey);

module.exports = router;