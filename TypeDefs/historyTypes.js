const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getHistory: [History]
    }
    extend type Mutation {
        addHistory(room: ID!): HistoryInfo
    }
    type HistoryInfo {
        message: String
    }
    type History {
        id: ID
        room: Rooms
        createdAt: Date
        updatedAt: Date
    }
`