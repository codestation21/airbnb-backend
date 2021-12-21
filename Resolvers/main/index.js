const {GraphQLDateTime} = require('graphql-iso-date');
const {GraphQLUpload} = require('graphql-upload');
const roomResolvers = require('../roomResolver');
const userResolvers = require('../userResolvers');
const bookingResolvers = require('../bookingResolver');
const reviewResolvers = require('../reviewResolver');
const historyResolvers = require('../historyResolver');


const customResolvers = {
    Date: GraphQLDateTime,
    Upload: GraphQLUpload
}
module.exports = [
    customResolvers,
    roomResolvers,
    userResolvers,
    bookingResolvers,
    reviewResolvers,
    historyResolvers
]