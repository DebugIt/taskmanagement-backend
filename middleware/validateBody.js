const Handler = require("../utils/handler");
const statuscodes = require("../utils/statuscodes")

const validateBody = (validationSchema) => async (req, res, next) => {
    try {
        // console.log("body: ", req.body)
        await validationSchema.validate(
            {
                body: req.body
            },
            {
                abortEarly: false,
            }
        )
        return next();
    } catch (error) {
        console.log(error)
        Handler(statuscodes.INTERNAL_SERVER_ERROR, false, "Internal Server Error", res, null)
    }
}

module.exports = validateBody