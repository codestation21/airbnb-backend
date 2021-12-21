const {User} = require('../Model/userModel');

module.exports.bathUsers = async (userIds) => {
    const users = await User.find({_id: {$in: userIds}});
    return userIds.map(userId => users.find(user => user.id === userId));
}