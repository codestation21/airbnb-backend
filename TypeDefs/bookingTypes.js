const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        checkRoomAvailability(input: checkInput): isAvailableInfo
        getAllBookedDate(roomId: ID!): [Date]
        getAllBooking: [Booking]
        getAdminBooking: [Booking]
        getBooking(id: ID!): Booking
        getAdminBook(id: ID): Booking
    }
    extend type Mutation {
        stripeCheckOut(input: paymentInput): sessionInfo
        deleteBooking(id: ID!): deleteInfo
    }
    input paymentInput {
        room: ID!
        successUrl: String!
        calcenlUrl: String!
        checkInDate: Date!
        checkOutDate: Date!
        daysOfStay: Int!
        amountPaid: Int!
    }
    input checkInput {
        roomId: ID!
        checkInDate: Date!
        checkOutDate: Date!
    }
    type isAvailableInfo {
        isAvailable: Boolean
    }
    type deleteInfo {
        message: String
    }
    type sessionInfo {
        id: String,
        message: String
    }
    type Booking {
        id: ID
        room: Rooms
        user: User
        checkInDate: Date
        checkOutDate: Date
        amountPaid: Int
        daysOfStay: Int
        paymentInfo: Payment
        paidAt: Date
        createdAt: Date
        updatedAt: Date
    }
    type Payment {
        id: String
        status: String
    }
`