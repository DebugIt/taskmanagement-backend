const jwt = require("jsonwebtoken");

const generateToken = async (userid) => {
    const token = jwt.sign({ id: userid }, process.env.JWT_SECRET, {
        expiresIn: "10h",
    });
    return token;
}

module.exports = generateToken;