const {Schema, model} = require("mongoose");
const jwt = require('jsonwebtoken');
const {stringToBase64} = require("../Middlewares/base");

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    avatar: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswrodExpired: String
}, {timestamps: true});

userSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        email: stringToBase64(this.email),
    }, process.env.JWT_SECRET_KEY, {expiresIn: "30d"});
    return token;
};

module.exports.User = model('User', userSchema);