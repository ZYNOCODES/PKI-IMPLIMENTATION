const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Paths to store keys
const PRIVATE_KEY_PATH = path.join(__dirname, "../keys", "private.key");
const PUBLIC_KEY_PATH = path.join(__dirname, "../keys", "public.key");

// Generate and store key pairs
function generateKeyPair() {
    if (!fs.existsSync(PRIVATE_KEY_PATH) || !fs.existsSync(PUBLIC_KEY_PATH)) {
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
        });

        fs.writeFileSync(PRIVATE_KEY_PATH, privateKey.export({ type: "pkcs1", format: "pem" }));
        fs.writeFileSync(PUBLIC_KEY_PATH, publicKey.export({ type: "pkcs1", format: "pem" }));
        console.log("Key pairs generated and stored!");
    }
}

// Sign data using the private key
function signData(data) {
    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
    const sign = crypto.createSign("SHA256");
    sign.update(data);
    sign.end();
    return sign.sign(privateKey, "base64");
}

// Verify data using the public key
function verifySignature(data, signature) {
    const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, "utf8");
    const verify = crypto.createVerify("SHA256");
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, "base64");
}

module.exports = {
    generateKeyPair,
    signData,
    verifySignature,
};
