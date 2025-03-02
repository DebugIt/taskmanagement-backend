const yup = require("yup");
module.exports.create_task = yup.object().shape({
    body: yup.object({
        taskname: yup.string().required("title required"),
        taskdescription: yup.string(),
        taskstatus: yup.string().oneOf(["Pending", "In Progress", "Completed"], "Invalid Status"),
        duedate: yup.string(),
        order: yup.number().integer().min(0, "Order has to be a positive number")
    }).noUnknown("No Extra fields allowed")
})

module.exports.update_task = yup.object().shape({
    body: yup.object({
        taskname: yup.string(),
        taskdescription: yup.string(),
        taskstatus: yup.string().oneOf(["Pending", "In Progress", "Completed"], "Invalid Status"),
        duedate: yup.string(),
        order: yup.number().integer().min(0, "Order has to be a positive number")
    }).noUnknown("No Extra fields allowed")
})