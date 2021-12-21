const {combineResolvers} = require("graphql-resolvers");

const {reviewInputValidate} = require("../Validation/reviewValidation");
const {isAuthenticated} = require("../Authorization/Autorize");
const {isAdmin} = require("../Authorization/Admin");
const {Review} = require("../Model/reviewModel");
const {Booking} = require("../Model/bookingModel");
const {Rooms} = require("../Model/roomModel");


module.exports = {
    Query: {
        getReviews: combineResolvers(isAuthenticated, async (_, {room}) => {
            const review = await Review.find({
                room: room
            });
            if (review.length === 0) throw new Error("There are no review yet!");
            return review;
        }),
        checkReviewAvailbilty: combineResolvers(isAuthenticated, async (_, {room}, {reqUserInfo}) => {
            const booking = await Booking.findOne({
                user: reqUserInfo._id,
                room: room
            });
            const review = await Review.findOne({
                user: reqUserInfo._id,
                room: room
            });
            let isCanAdd = false;
            if (booking) isCanAdd = true
            let isCanUpdate = false;
            if (review) isCanUpdate = true
            return {
                isCanAdd,
                isCanUpdate
            }
        })
    },
    Mutation: {
        addReviews: combineResolvers(isAuthenticated, async (_, {input}, {reqUserInfo}) => {
            const {error} = reviewInputValidate(input);
            if (error) throw new Error(error.details[0].message);
            const hasReview = await Review.findOne({
                room: input.room,
                user: reqUserInfo._id
            });
            if (hasReview) throw new Error("You already leave a review. You can edit that!")
            const booking = await Booking.find({
                room: input.room,
                user: reqUserInfo._id
            });
            if (booking.length === 0) throw new Error("First create some bookings!")
            const room = await Rooms.findOne({
                _id: input.room
            });
            if (!room) throw new Error("Room not found!");
            const review = new Review({
                room: input.room,
                user: reqUserInfo._id,
                rating: input.rating,
                comment: input.comment
            });
            await review.save();
            const allreview = await Review.find();
            room.ratings = allreview.reduce((acc, item) => item.rating + acc, 0) / allreview.length
            room.numOfReviews = allreview.length;
            await room.save();
            return {
                message: "Review Added Successfully!"
            }
        }),
        updateReviews: combineResolvers(isAuthenticated, async (_, {input}, {reqUserInfo}) => {
            const review = await Review.findOne({
                room: input.room,
                user: reqUserInfo._id
            });
            if (!review) throw new Error("Review not find!");
            review.rating = input.rating;
            review.comment = input.comment
            await review.save();
            const room = await Rooms.findOne({
                _id: review.room
            })
            const allreview = await Review.find();
            room.ratings = allreview.reduce((acc, item) => item.rating + acc, 0) / allreview.length
            await room.save();
            return {
                message: "Review Updated successfully!"
            }
        }),
        deleteReviews: combineResolvers(isAuthenticated, isAdmin, async(_, {id}) => {
            const reviews = await Review.findByIdAndDelete(id);
            if(!reviews) throw new Error("Reviews not found!");
            return reviews;
        })
    },
    Reviews: {
        user: async (parent, _, {loaders}) => {
            const user = await loaders.users.load(parent.user.toString());
            return user;
        }
    }
}