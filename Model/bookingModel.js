const {Schema, model} = require("mongoose");
const timeZone = require("mongoose-timezone");

module.exports.Booking = model('Booking', Schema({
    room: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Rooms'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    checkInDate: {
        type: Date,
    },
    checkOutDate: {
        type: Date,
    },
    amountPaid: {
        type: Number,
    },
    daysOfStay: {
        type: Number,
    },
    paymentInfo: {
        id: {
            type: String,
        },
        status: {
            type: String,
        }
    },
    paidAt: {
        type: Date,
    }
}, {timestamps: true}).plugin(timeZone));