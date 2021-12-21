const Joi = require("joi");
module.exports.inputValidate = room => {
    const schema = Joi.object({
        name: Joi.string().required().max(100).messages({
            'string.empty': 'Room name is not allowed to be empty!',
            'any.required': 'Please enter room name!',
            'string.max': 'Room name cannot exceed 100 characters!',
            'string.base': "Name must be a string!"
        }),
        price: Joi.number().required().messages({
            'string.empty': 'Room price is not allowed to be empty!',
            'any.required': 'Please enter room price!',
            'number.base': "Price must be a number!"
        }),
        description: Joi.string().required().messages({
            'string.empty': 'Room description is not allowed to be empty!',
            'any.required': 'Please enter room description!',
            'string.base': "Description must be a string!"
        }),
        address: Joi.string().required().messages({
            'string.empty': 'Address is not allowed to be empty!',
            'any.required': 'Please enter address!',
            'string.base': "Address must be a string!"
        }),
        guestCapacity: Joi.string().required().messages({
            'string.empty': 'Guest Capacity is not allowed to be empty!',
            'any.required': 'Please enter guest capacity!',
            'string.base': "Guest Capacity must be a string!"
        }),
        numOfBeds: Joi.string().required().messages({
            'string.empty': 'Number of beds is not allowed to be empty!',
            'any.required': 'Please enter number of beds in room!',
            'string.base': "Number of beds must be a string!"
        }),
        numOfBaths: Joi.string().required().messages({
            'string.empty': 'Number of baths is not allowed to be empty!',
            'any.required': 'Please enter baths of beds in room!',
            'string.base': "Number of baths must be a string!"
        }),
        internet: Joi.boolean().allow("").messages({
            'boolean.base': "Internet must be a boolean value!"
        }),
        breakFast: Joi.boolean().allow("").messages({
            'boolean.base': "Break fast must be a boolean value!"
        }),
        airConditioned: Joi.boolean().allow("").messages({
            'boolean.base': "Air Conditioned must be a boolean value!"
        }),
        petsAllowed: Joi.boolean().allow("").messages({
            'boolean.base': "Pets Allowed must be a boolean value!"
        }),
        roomCleaning: Joi.boolean().allow("").messages({
            'boolean.base': "Room Cleaning must be a boolean value!"
        }),
        category: Joi.string().required().valid('king', 'single', 'twins').messages({
            'string.empty': 'Category is not allowed to be empty!',
            'any.required': 'Please ente room category!',
            'string.base': "Category must be a string!",
            'any.only': "Category must be on of King, Single, Twins!"
        }),
    })
    return schema.validate(room);
}