const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getAllUser: [User]
        getUser: User
    }
    extend type Mutation {
        signUp(input: signupInput, avatar: Upload!): userInfo
        Login(input: loginInput): userInfo
        deleteUser: deleteUserInfo
        updateUser(input: updateInput, avatar: Upload): updateInfo
        forgotPassword(email: String!, originUrl: String!): updateInfo
        resetPassword(password: String!, token: String!): updateInfo
        updateUserAdmin(id: ID!, input: adminUpdateInput): updateInfo
        deleteUserAdmin(id: ID!): deleteInfo
    }
    input signupInput {
        name: String!
        email: String!
        password: String!
    }
    input loginInput {
        email: String!
        password: String!
    }
    input updateInput {
        name: String
        password: String
    }
    input adminUpdateInput {
        name: String,
        email: String,
        role: String
    }
    type userInfo {
        message: String
        token: String
    }
    type deleteUserInfo {
        message: String
        name: String
    }
    type updateInfo {
        message: String
    }
    type User {
        id: ID
        name: String
        email: String
        avatar: String
        role: String
        createdAt: Date
        updatedAt: Date
    }
`;