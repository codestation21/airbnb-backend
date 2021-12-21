const {combineResolvers} = require("graphql-resolvers");
const {isAuthenticated} = require("../Authorization/Autorize");
const {History} = require("../Model/historyModel");


module.exports = {
    Query: {
        getHistory: combineResolvers(isAuthenticated, async (_, __, {reqUserInfo}) => {
            const history = await History.find({
                user: reqUserInfo
            }).sort({_id: -1})
            return history;
        })
    },
    Mutation: {
        addHistory: combineResolvers(isAuthenticated, async (_, {room}, {reqUserInfo}) => {
            const hasHistory = await History.findOne({
                user: reqUserInfo._id,
                room: room
            });
            if (!hasHistory) {
                const newHistory = new History({
                    user: reqUserInfo._id,
                    room: room
                });
                await newHistory.save();
                const history = await History.find({
                    user: reqUserInfo._id
                });
                if (history.length > 8) {
                    await History.findByIdAndDelete(history[0]._id);
                }
                return {
                    message: "History Added Successfully!"
                }
            } else {
                const newHistory = new History({
                    user: reqUserInfo._id,
                    room: room
                });
                await newHistory.save();
                await History.findByIdAndDelete(hasHistory._id);
                return {
                    message: "History Added Successfully!"
                }
            }
        })
    },
    History: {
        room: async (parent, _, {loaders}) => {
            const room = await loaders.rooms.load(parent.room.toString());
            return room;
        }
    }
}