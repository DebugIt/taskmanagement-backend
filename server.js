const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3333
const cors = require("cors")

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// connections
require("./DB/connection")

// routes
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

app.use("/api/v1/user", userRouter)
app.use("/api/v1/tasks", taskRouter)

app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`);
})