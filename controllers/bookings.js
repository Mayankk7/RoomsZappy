const Booking = require("../models/booking")
const moment = require("moment")
const { v4: uuidv4 } = require('uuid');
const Room = require("../models/room")
const User = require("../models/user")
const stripe = require("stripe")('sk_test_51KIT1CSCLQbR5TPEcrSguI802lHr4JnLdX7DRHuI9cvJDmwH2BdmdMNXdeMYfLUlAV6zORXfuAf6FsvGtHPBO7aM00Qxh6VdAl')
const sendMail = require("../utils/mailer")

//function that allows a user to book a room 
const BookRoom = async (req, res) => {

    const { room,
        userid,
        fromdate,
        todate,
        totalamount,
        totaldays,
        token } = req.body

    try {

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })
        console.log("Customer Created")
        const payment = stripe.charges.create({
            amount: totalamount * 100,
            currency: "inr",
            customer: customer.id,
            receipt_email: token.email
        }, {
            idempotencyKey: uuidv4()
        });
        console.log("Payment Successful")


        if (payment) {

            const newbooking = new Booking({
                room: room.name,
                roomid: room._id,
                userid,
                fromdate: moment(fromdate).format("DD-MM-YYYY"),
                todate: moment(todate).format("DD-MM-YYYY"),
                totalamount,
                totaldays,
                transactionId: '1234'
            })

            const booking = await newbooking.save();
            const roomtemp = await Room.findOne({ _id: room._id })

            roomtemp.currentbookings.push({
                bookingid: booking._id,
                fromdate: moment(fromdate).format("DD-MM-YYYY"),
                todate: moment(todate).format("DD-MM-YYYY"),
                userid: userid,
                status: booking.status
            });

            await roomtemp.save();

            console.log("Room Booked ");

            let id = newbooking.userid;

            const bookeduser = await User.findOneById({ id })

            let output = `
            <h1>Congratulations !</h1>
            Your stay in ${bookeduser.name} has been confirmed from ${newbooking.fromdate} to ${newbooking.todate}.
            Hope you have a great vacation ! 
            Thankyou for booking with RoomsZappy. 
            `

            let subject = "Booking Done Successfully"
            sendMail(bookeduser, output, subject)

        }


        res.send('Payment Successful, Your Room is Booked ');

    } catch (error) {
        return res.status(400).json({ error });
    }

}


//function that allows a user to get bookings by id 
const getBookingById = async (req, res) => {

    const userid = req.body.userid

    try {
        const bookings = await Booking.find({ userid: userid })
        res.send(bookings)

    } catch (error) {
        return res.status(400).json({ error })
    }

}


//function to cancel a booking 
const CancelBooking = async (req, res) => {

    const { bookingid, roomid } = req.body;

    try {

        const bookingitem = await Booking.findOne({ _id: bookingid })
        bookingitem.status = "cancelled"

        await bookingitem.save()

        const room = await Room.findOne({ _id: roomid })
        const bookings = room.currentbookings

        const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid)
        room.currentbookings = temp;

        await room.save();

        res.send("Your booking cancelled Sucessfully")

    } catch (error) {
        return res.status(400).json({ error });
    }

}


//function to get all bookings 
const getBookings = async (req, res) => {

    try {

        const bookings = await Booking.find({})
        res.send(bookings)

    } catch (error) {
        return res.status(400).json({ error })
    }

}

module.exports = { BookRoom, getBookingById, CancelBooking, getBookings }