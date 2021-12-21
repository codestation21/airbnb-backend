const {gql} = require('apollo-server-express');

const roomTypeDefs = require('../roomTypes');
const userTypeDefs = require('../userTypes');
const bookingTypeDefs = require('../bookingTypes');
const reviewTypeDefs = require('../reviewTypes');
const historTypeDefs = require('../historyTypes');

const typeDefs = gql`
    scalar Date
    scalar Upload
    type Query {
        _: String
    }
    type Mutation {
        _:String
    }
`;

module.exports = [
    typeDefs,
    roomTypeDefs,
    userTypeDefs,
    bookingTypeDefs,
    reviewTypeDefs,
    historTypeDefs
]