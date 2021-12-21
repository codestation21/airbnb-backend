const {Schema, model} = require('mongoose');
const Joi = require('joi');

module.exports.Rooms = model('Rooms', Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        default: 23.70
    },
    lng: {
        type: String,
        default: 90.38
    },
    guestCapacity: {
        type: String,
        required: true
    },
    numOfBeds: {
        type: String,
        required: true
    },
    numOfBaths: {
        type: String,
        required: true
    },
    internet: {
        type: Boolean,
        default: false
    },
    breakFast: {
        type: Boolean,
        default: false
    },
    airConditioned: {
        type: Boolean,
        default: false
    },
    petsAllowed: {
        type: Boolean,
        default: false
    },
    roomCleaning: {
        type: Boolean,
        default: false
    },
    ratings: {
        type: String,
        default: 0
    },
    numOfReviews: {
        type: String,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    images: [
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true}));