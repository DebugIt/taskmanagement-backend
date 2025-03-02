const yup = require("yup");

module.exports.validateuserbody = yup.object().shape({
    body: yup.object({
        email: yup.string().email().required("Email is required"),
        password: yup.string().required("Password is required"),
    }).noUnknown("No external fields allowed")
})