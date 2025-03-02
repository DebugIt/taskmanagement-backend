const bcrypt = require("bcryptjs");

const encryptPassword = async (password) => {
    const hashedPass = bcrypt.hashSync(password, 10);
    return hashedPass;
}

module.exports = encryptPassword;