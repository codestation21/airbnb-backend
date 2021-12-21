const stripe = require("stripe");
const {User} = require("../Model/userModel");
const {Booking} = require("../Model/bookingModel");

module.exports.stripeWebhook = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_KEY);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const room = session.client_reference_id;
            const user = (await User.findOne({email: session.customer_email})).id;
            const amountPaid = session.amount_total / 100;
            const paymentInfo = {
                id: session.payment_intent,
                status: session.payment_status
            }
            const checkInDate = session.metadata.checkInDate;
            const checkOutDate = session.metadata.checkOutDate;
            const daysOfStay = session.metadata.daysOfStay;
            const booking = new Booking({
                room,
                user,
                checkInDate: new Date(checkInDate * 1000),
                checkOutDate: new Date(checkOutDate * 1000),
                amountPaid,
                daysOfStay,
                paymentInfo,
                paidAt: new Date()
            })
            await booking.save();
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    response.send();
}