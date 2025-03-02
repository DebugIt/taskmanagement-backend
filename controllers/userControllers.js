const User = require("../models/User");
const encryptPassword = require("../utils/encryptPassword");
const checkPassword = require("../utils/checkPassword");
const generateToken = require("../utils/generateToken");
const Handler = require("../utils/handler");
const statuscodes = require("../utils/statuscodes");

module.exports.create_user = async (req, res, next) => {
    const { email, password } = req.body
    
    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
        Handler(statuscodes.BAD_REQUEST, false, "User ALready Exists", res, null)
    }
    else{
        const hashedPassword = await encryptPassword(password);
        const newUser = await new User({
            email,
            password: hashedPassword
        }).save();

        if(newUser){
            Handler(statuscodes.CREATED, true, "User Created Successfully", res, null)
        }
        else{
            Handler(statuscodes.INTERNAL_SERVER_ERROR, false, "Failed to Create User", res, null)
        }
    }
}

module.exports.login_user = async (req, res, next) => {
    const { email, password } = req.body
    const findUser = await User.findOne({ email });
    if (!findUser) {
        Handler(statuscodes.NOT_FOUND, false, "User Not Found", res, null)
    }
    else{
        const isMatch = await checkPassword(password, findUser.password);
        if (!isMatch) {
            Handler(statuscodes.UNAUTHORIZED, false, "Invalid Credentials", res, null)
        }
        else{
            const token = await generateToken(findUser._id);
            Handler(statuscodes.SUCCESS, true, "Logged in successfully", res, token);
        }
    }

}