const { verifySignature } = require("../util/pki");
const CustomError = require('../util/CustomError.js');

function pkiMiddleware(req, res, next) {
    const { signature, data } = req.body;
    
    if (!signature || !data) {
        return next(new CustomError("Signature and data are required.", 400));
    }

    try {
        const isValid = verifySignature(data, signature);
        if (!isValid) {
            return next(new CustomError("Invalid signature.", 400));
        }

        // Attach verified data to the request
        req.verifiedData = JSON.parse(data);
        next();
    } catch (error) {
        console.error("Signature verification error:", error.message);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
}

module.exports = pkiMiddleware;
