const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {User} = require("../Model/userModel");
const {combineResolvers} = require("graphql-resolvers");
const {isAuthenticated} = require("../Authorization/Autorize");
const {isAdmin} = require("../Authorization/Admin");
const {signupValidation, loginValidation} = require("../Validation/userValidation");
const {readFile, deleteFile} = require("../Middlewares/file");
const {sendEmail} = require("../Middlewares/sendEmail");

module.exports = {
    Query: {
        getAllUser: combineResolvers(isAuthenticated, isAdmin, async () => {
            const users = await User.find();
            if(users.length === 0) throw new Error("No user found!");
            return users;
        }),
        getUser: combineResolvers(isAuthenticated, async (_, __, {reqUserInfo}) => {
            return reqUserInfo;
        })
    },
    Mutation: {
        signUp: async (_, {input, avatar}) => {
            const {error} = signupValidation(input);
            if (error) throw new Error(error.details[0].message);
            const hasUser = await User.findOne({
                email: input.email
            })
            if (hasUser) throw new Error("User already registered");
            const url = await readFile(avatar);
            let user = new User({...input, avatar: url});
            user.password = await bcrypt.hash(user.password, 12);
            let token = user.generateJWT();
            await user.save();
            return {
                message: "User created successfully!",
                token
            }
        },
        Login: async (_, {input}) => {
            const {error} = loginValidation(input);
            if (error) throw new Error(error.details[0].message);
            let user = await User.findOne({
                email: input.email
            }).select("+password")
            if (!user) throw new Error("Invalid email or password!");
            const isValidPassword = await bcrypt.compare(input.password, user.password);
            if (!isValidPassword) throw new Error("Invalid email or password!");
            let token = user.generateJWT();
            return {
                message: "User loggedin Successfully!",
                token
            }
        },
        deleteUser: combineResolvers(isAuthenticated, async (_, __, {reqUserInfo}) => {
            const user = await User.findByIdAndDelete(reqUserInfo._id);
            if (user.avatar) {
                await deleteFile(user.avatar);
            }
            return {
                message: "User deleted successfully!",
                name: user.name
            }
        }),
        updateUser: combineResolvers(isAuthenticated, async (_, {input, avatar}, {reqUserInfo}) => {
            Object.keys(input).forEach((key) => input[key] == '' && delete input[key]);
            let hashPassword
            if (input.password) {
                hashPassword = await bcrypt.hash(input.password, 10);
            }
            let url
            if (avatar) {
                url = await readFile(avatar);
            }
            if (avatar && reqUserInfo.avatar) {
                await deleteFile(reqUserInfo.avatar);
            }
            const result = await User.findByIdAndUpdate(reqUserInfo._id, {
                name: input.name,
                password: hashPassword,
                avatar: url
            }, {new: true});
            return {
                message: "User updated successfully!"
            }
        }),
        forgotPassword: async (_, {email, originUrl}) => {
            let user = await User.findOne({
                email: email
            });
            if (!user) throw new Error("No user found with this email!");
            const resetToken = crypto.randomBytes(10).toString("hex");
            const token = crypto.createHash("sha256").update(resetToken).digest("hex");
            const resetPassExpire = Date.now() + 30 * 60 * 1000;
            const mailOptions = {
                email: email,
                subject: "Password reset",
                html: `<p>Here is pasword reset link</p>
                    <a href='${originUrl}/${resetToken}'>${originUrl}/${resetToken}</a>`
            }
            sendEmail(mailOptions);
            user.resetPasswordToken = token
            user.resetPasswrodExpired = resetPassExpire
            await user.save();
            return {
                message: `Password reset email sent to ${user.email}`
            }
        },
        resetPassword: async (_, {password, token}) => {
            const resetToken = crypto.createHash("sha256").update(token).digest("hex");
            let user = await User.findOne({
                resetPasswordToken: resetToken,
                resetPasswrodExpired: {$gt: Date.now()}
            });
            if (!user) throw Error("Password reset token is invalid or has been expired!");
            const passwordHash = await bcrypt.hash(password, 10);
            user.password = passwordHash
            user.resetPasswordToken = null
            user.resetPasswrodExpired = null
            await user.save();
            return {
                message: "Password reset successfully!"
            }
        },
        updateUserAdmin: combineResolvers(isAuthenticated, isAdmin, async(_, {id, input}) => {
            Object.keys(input).forEach((key) => input[key] == '' && delete input[key]);
            const user = await User.findByIdAndUpdate(id, {...input}, {new: true})
            if(!user) throw new Error("No user found!");
            return {
                message: "User updated successfully!"
            }
        }),
        deleteUserAdmin: combineResolvers(isAuthenticated, isAdmin, async(_, {id}) => {
            const user = await User.findByIdAndDelete(id);
            if(!user) throw new Error("User not found!");
            if(user.avatar) {
                await deleteFile(user.avatar)
            }
            return {
                message: "User deleted successfully1",
                name: user.name
            }
        })
    }
}