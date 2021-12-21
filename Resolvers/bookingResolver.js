const {combineResolvers} = require("graphql-resolvers");
const Moment = require('moment');
const {extendMoment} = require("moment-range");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const {isAuthenticated} = require('../Authorization/Autorize');
const {isAdmin} = require('../Authorization/Admin');
const {Booking} = require('../Model/bookingModel');
const {User} = require('../Model/userModel');
const {Rooms} = require('../Model/roomModel');

const moment = extendMoment(Moment);


module.exports = {
    Query: {
        checkRoomAvailability: combineResolvers(isAuthenticated, async (_, {input}) => {
            const checkInDate = new Date(input.checkInDate);
            const checkOutDate = new Date(input.checkOutDate);

            const bookings = await Booking.find({
                room: input.roomId,
                $and: [
                    {
                        checkInDate: {
                            $lte: checkOutDate
                        }
                    },
                    {
                        checkOutDate: {
                            $gte: checkInDate
                        }
                    }
                ]
            })
            let isAvailable;
            if (bookings && bookings.length === 0) {
                isAvailable = true
            } else {
                isAvailable = false
            }
            return {
                isAvailable
            }
        }),
        getAllBookedDate: combineResolvers(isAuthenticated, async (_, {roomId}) => {
            const bookings = await Booking.find({room: roomId});
            let bookedDates = [];
            const timeDifference = moment().utcOffset() / 60
            bookings.forEach(booking => {
                const checkInDate = moment(booking.checkInDate).add(timeDifference, 'hours');
                const checkOutDate = moment(booking.checkOutDate).add(timeDifference, 'hours');
                const range = moment.range(moment(checkInDate), moment(checkOutDate));
                const dates = Array.from(range.by('day'));
                bookedDates = bookedDates.concat(dates);
            })
            bookedDates = bookedDates.map(a => a.toISOString());
            return bookedDates;
        }),
        getAllBooking: combineResolvers(isAuthenticated, async (_, __, {reqUserInfo}) => {
            const booking = await Booking.find({
                user: reqUserInfo._id
            });
            if (booking.length === 0) throw new Error("You have no booking yet!")
            return booking;
        }),
        getAdminBooking: combineResolvers(isAuthenticated, isAdmin, async () => {
            const booking = await Booking.find();
            if(booking.length === 0) throw new Error("No booking yet!");
            return booking;
        }),
        getBooking: combineResolvers(isAuthenticated, async (_, {id}, {reqUserInfo}) => {
            const booking = await Booking.findOne({
                _id: id,
                user: reqUserInfo._id
            });
            if (!booking) throw new Error("You have no Booking yet!");
            return booking;
        }),
        getAdminBook: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const booking = await Booking.findOne({
                _id: id
            });
            if(!booking) throw new Error("Booking not found!");
            return booking;
        })
    },
    Mutation: {
        stripeCheckOut: combineResolvers(isAuthenticated, async (_, {input}, {reqUserInfo}) => {
            const room = await Rooms.findById(input.room);
            const {checkInDate, checkOutDate, daysOfStay} = input;
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                success_url: input.successUrl,
                cancel_url: input.calcenlUrl,
                customer_email: reqUserInfo.email,
                client_reference_id: input.room,
                metadata: {checkInDate, checkOutDate, daysOfStay},
                line_items: [
                    {
                        name: room.name,
                        images: [`${room.images[0].url}`],
                        amount: input.amountPaid * 100,
                        currency: 'usd',
                        quantity: 1
                    }
                ]
            })
            return {
                message: "You will be redirected shortly!",
                id: session.id
            }
        }),
        deleteBooking: combineResolvers(isAuthenticated, isAdmin, async(_, {id}) => {
            const booking = await Booking.findByIdAndDelete(id);
            if(!booking) throw new Error("Booking not found!");
            return {
                message: "Booking deleted successfully!"
            }
        })
    },
    Booking: {
        user: async (parent) => {
            const user = await User.findOne({
                _id: parent.user
            })
            return user;
        },
        room: async (parent) => {
            const room = await Rooms.findOne({
                _id: parent.room
            })
            return room;
        }
    }
}