const validateBody = require("../middleware/validateBody");
const handleAsync = require("../utils/handleAsync");
const taskRouter = require("express").Router();
const isUser = require("../middleware/isUser");
const { createtask, updatetask, delete_task, gettasks } = require("../controllers/taskControllers");
const { create_task, update_task } = require("../validation/task");

// create
// update
// delete
// get all users task : with filtlers like (pending, inprogress, completed, due, all)

taskRouter.post("/task", isUser, validateBody(create_task), handleAsync(createtask))
taskRouter.put("/task/:id", isUser, validateBody(update_task), handleAsync(updatetask))
taskRouter.delete("/task/:id", isUser, handleAsync(delete_task))
taskRouter.get("/task", isUser, handleAsync(gettasks))

module.exports = taskRouter