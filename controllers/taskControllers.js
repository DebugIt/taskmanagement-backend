const Task = require("../models/Task");
const Handler = require("../utils/handler");
const statuscodes = require("../utils/statuscodes");

module.exports.createtask = async (req, res, next) => {
    const { taskname, taskdescription, taskstatus, duedate, order } = req.body
    const { id } = req.user

    // findifg the order of the latest task
    let lastorder = 0;
    const lastTask = await Task.findOne({ user: id }).sort({ order: -1 })
    if (lastTask) lastorder = lastTask.order

    const newTaskOrder = order ? order : lastorder+1

    const newTask = await new Task({
        taskname, taskdescription, taskstatus, duedate, order: newTaskOrder, user: id
    }).save()
    // console.log("new: ", newTask)
    if(newTask){
        Handler(statuscodes.CREATED, true, "Task Created", res, null)
    }
    else{
        Handler(statuscodes.INTERNAL_SERVER_ERROR, false, "Error Creating Task", res, null)
    }
}

module.exports.updatetask = async (req, res, next) => {
    const { id } = req.params;
    const { taskname, taskdescription, taskstatus, duedate, order } = req.body;
    const { id: userId } = req.user;

    try {
        const findTask = await Task.findOne({ _id: id, user: userId });

        if (!findTask) {
            return Handler(statuscodes.NOT_FOUND, false, "Task Not Found", res, null);
        }

        if (order && order !== findTask.order) {
            let userTasks = await Task.find({ user: userId }).sort({ order: 1 });
            userTasks = userTasks.filter(task => task._id.toString() !== id);
            userTasks.splice(order - 1, 0, findTask);

            for (let i = 0; i < userTasks.length; i++) {
                userTasks[i].order = i + 1;
                await userTasks[i].save();
            }
        }

        // Update task details
        findTask.taskname = taskname || findTask.taskname;
        findTask.taskdescription = taskdescription || findTask.taskdescription;
        findTask.taskstatus = taskstatus || findTask.taskstatus;
        findTask.duedate = duedate || findTask.duedate;

        await findTask.save();

        Handler(statuscodes.SUCCESS, true, "Task Updated", res, null);
    } catch (error) {
        Handler(statuscodes.INTERNAL_SERVER_ERROR, false, "Internal Server Error", res, error);
    }
};

module.exports.delete_task = async (req, res, next) => {
    const { id } = req.params
    const findTask = await Task.find({_id: id, user:req.user.id});
    if(!findTask){
        Handler(statuscodes.NOT_FOUND, false, "Task Not Found", res, null)
    }
    else{
        const deleteTask = await Task.findByIdAndDelete(id);
        if(deleteTask){
            Handler(statuscodes.SUCCESS, true, "Task Deleted", res, null)
        }
        else{
            Handler(statuscodes.INTERNAL_SERVER_ERROR, false, "Internal Server Error", res, null)
        }
    }
}

module.exports.gettasks = async (req, res, next) => {
    const { id, status, due , page = 1, limit = 10} = req.query;
    let query = {
        user: req.user.id
    }
    if(id) query._id = id
    if(status) query.taskstatus = status === "InProgress" ? "In Progress" : status
    if(due){
        const daystart = new Date(due)
        daystart.setHours(0, 0, 0, 0)
        const dayend = new Date(due)
        dayend.setHours(23, 59, 59, 999)
        query.duedate = { $gte: daystart, $lte: dayend }
    }

    try {
        
        const pageNumber = Math.max(parseInt(page, 10), 1);
        const limitNumber = Math.max(parseInt(limit, 10), 1);
        const skip = (pageNumber - 1) * limitNumber;

        const totalTasks = await Task.countDocuments(query);

        const gettasks = await Task.find(query)
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 })

        if (gettasks.length > 0) {
            Handler(statuscodes.SUCCESS, true, "Tasks fetched", res, {
                tasks: gettasks,
                totalTasks,
                totalPages: Math.ceil(totalTasks / limitNumber),
                currentPage: pageNumber
            });
        } else {
            Handler(statuscodes.NOT_FOUND, false, "No Tasks Found", res, {
                tasks: [],
                totalTasks,
                totalPages: Math.ceil(totalTasks / limitNumber),
                currentPage: pageNumber
            });
        }
    } catch (error) {
        next(error);
    }
    
}