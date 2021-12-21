const Joi = require("joi");

module.exports.reviewInputValidate = review => {
    const schema = Joi.object({
        room: Joi.string().required().max(100).messages({
            'string.empty': 'Room is not allowed to be empty!',
            'any.required': 'Please enter room!',
            'string.max': 'Room cannot exceed 100 characters!',
            'string.base': "Room must be a string!"
        }),
        rating: Joi.number().required().messages({
            'string.empty': 'Rating is not allowed to be empty!',
            'any.required': 'Please enter rating!',
            'number.base': " Rating must be a number!"
        }),
        comment: Joi.string().required().messages({
            'string.empty': 'Comment is not allowed to be empty!',
            'any.required': 'Please enter comment!',
            'string.base': "Comment must be a string!"
        })
    })
    return schema.validate(review);
}