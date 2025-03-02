const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskname: {
        type: String,
        required: true
    },
    taskdescription: {
        type: String,
    },
    taskstatus: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    duedate: {
        type: Date
    },
    order: {
        type: Number,
        required: true
    }
}, { timestamps: true });
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;