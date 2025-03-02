const validateBody = require("../middleware/validateBody");
const { validateuserbody } = require("../validation/user");
const handleAsync = require("../utils/handleAsync");
const { create_user, login_user } = require("../controllers/userControllers");
const userRouter = require("express").Router();

userRouter.post("/create", validateBody(validateuserbody), handleAsync(create_user));
userRouter.post("/login", validateBody(validateuserbody), handleAsync(login_user));


module.exports = userRouter