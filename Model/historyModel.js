const {Schema, model} = require("mongoose");

module.exports.History = model('History', Schema({
    room: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Rooms'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {timestamps: true}))