const User = require("../models/User");
const Handler = require("../utils/handler")
const statuscodes = require("../utils/statuscodes");
const jwt = require("jsonwebtoken");

const isUser = async (req, res, next) => {
    try {
        const session = req.headers["token"] || req.cookies.token;
        if (!session) {
            return res.status(statuscodes.UNAUTHORIZED).json({ status:401, message: "Unauthorized" });
        }
        else{
            const extractDetails = await jwt.verify(session, process.env.JWT_SECRET);
            console.log("extracted details: ", extractDetails);
            
            const foundUser = await User.findOne({ _id: extractDetails.id }).select(" -password -__v -createdAt -updatedAt ");
            if (!foundUser) {
                Handler(statuscodes.NOT_FOUND, false, "User not found", res, null)
            }
            else{
                req.user = {
                    id: foundUser._id,
                }
                next();
            }
        }
    }
    catch(err){
        Handler(statuscodes.INTERNAL_SERVER_ERROR, false, "Internal Server Error", res, null);
    }
}

module.exports = isUser