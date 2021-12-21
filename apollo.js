const {ApolloServer} = require('apollo-server-express');
const Dataloader = require('dataloader');
const typeDefs = require('./TypeDefs/main');
const resolvers = require('./Resolvers/main');
const loaders = require("./Loaders/main");
const {Token} = require("./Authorization/Token");

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        await Token(req);
        return {
            reqUserInfo: req.user,
            loaders: {
                users: new Dataloader(keys => loaders.userLoaders.bathUsers(keys)),
                rooms: new Dataloader(keys => loaders.roomLoaders.bathRooms(keys))
            }
        }
    },
    formatError: (error) => {
        return {
            message: error.message
        }
    }
});

module.exports = apolloServer;