import mongoose from "mongoose";

const BookingsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bookDate: { type: Date },
    adults: { type: Number },
    adultsNames: { type: [String] },
    kids: { type: Number },
    kidsNames: { type: [String] },
    kidsAges: { type: [String] },
    hotel: { type: String },
    dates: {type: [Date]},
    outDate: { type: Date },
    roomId: { type: String },
    roomType: { type: String },
    status: { type: String },
    notes: { type: String },
    user: { type: String },
})

const bookingModel = mongoose.model("bookings", BookingsSchema)

export default bookingModel