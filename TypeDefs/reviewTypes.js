const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getReviews(room: ID!): [Reviews]
        checkReviewAvailbilty(room: ID!): checkedData
    }
    extend type Mutation {
        addReviews(input: reviewInput) : reviewInfo
        updateReviews(input: updateReviewInput): reviewInfo
        deleteReviews(id: ID!): reviewInfo
    }
    input reviewInput {
        room: ID!
        rating: Int!
        comment: String!
    }
    input updateReviewInput {
        room: ID!
        rating: Int,
        comment: String
    }
    type Reviews {
        id: ID!
        user: User
        rating: String
        comment: String
        createdAt: Date
        updatedAt: Date
    }
    type reviewInfo {
        message: String
    }
    type checkedData {
        isCanAdd: Boolean
        isCanUpdate: Boolean
    }
`;