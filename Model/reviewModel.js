const {Schema, model} = require("mongoose");

module.exports.Review = model('Review', Schema({
    room: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Rooms'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, {timestamps: true}))
