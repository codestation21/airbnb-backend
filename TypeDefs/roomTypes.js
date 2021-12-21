const {gql} = require('apollo-server-express');

module.exports = gql`
    extend type Query {
        getAllRooms: [Rooms]
        getRooms(input: filtersInput): RoomsData
        getRoom(id: ID!): Rooms
    }
    extend type Mutation {
        addRooms(input: roomsInput, images: [Upload]!): addRoomInfo
        updateRooms(input: roomsUpdateInput, id: ID! images: [Upload]): addRoomInfo
        deleteRooms(id: ID!): RoomInfoMessage
    }
    input filtersInput {
        order: String
        sortBy: String
        limit: Int
        page: String
        filters: Filters
    }
    input Filters {
        name: String
        price: [String]
        category: String
        location: String
        guestCapacity: String
    }
    input roomsInput {
        name: String!
        price: String!
        description: String!
        address: String!
        guestCapacity: String!
        numOfBeds: String!
        numOfBaths: String!
        internet: Boolean
        breakFast: Boolean
        airConditioned: Boolean
        petsAllowed: Boolean
        roomCleaning: Boolean
        category:String
    }
    input roomsUpdateInput {
        name: String
        price: String
        description: String
        address: String
        guestCapacity: String
        numOfBeds: String
        numOfBaths: String
        internet: Boolean
        breakFast: Boolean
        airConditioned: Boolean
        petsAllowed: Boolean
        roomCleaning: Boolean
        category:String
    }
    type RoomsData {
        rooms: [Rooms]
        pageInfo: PageInfo
    }
    type PageInfo {
        resultPerPage: Int
        count: Int
    }
    type Rooms {
        id: ID
        name: String
        price: String
        description: String
        address: String
        lat: String
        lng: String
        guestCapacity: String
        numOfBeds: String
        numOfBaths: String
        internet: Boolean
        breakFast: Boolean
        airConditioned: Boolean
        petsAllowed: Boolean
        roomCleaning: Boolean
        ratings: String
        numOfReviews: String
        category: String
        images: [Images]
        createdAt: Date
        updatedAt: Date
    }
    type Images {
        url: String
        id: ID
    }
    type addRoomInfo {
        message: String
    }
    type RoomInfoMessage {
        message: String
        id: ID
        name: String
        price: String
    }
`;