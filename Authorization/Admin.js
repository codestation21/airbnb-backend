const {skip} = require('graphql-resolvers');

module.exports.isAdmin = (_, __, {reqUserInfo}) => {
    if (reqUserInfo.role !== "admin") throw new Error("Forbidden! Unauthorized request.");
    return skip;
}