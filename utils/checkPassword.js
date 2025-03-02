const bcrypt = require("bcryptjs");

const checkPassword = async (pass, userpass) => {
    const isValid = await bcrypt.compare(pass, userpass);
    return isValid;
}

module.exports = checkPassword