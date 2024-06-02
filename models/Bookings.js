import mongoose from "mongoose";

const BookingsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    book_date: { type: Date },
    persons_number: { type: Number },
    persons_names: { type: String },
    kids_number: { type: Number },
    kids_names: { type: String },
    kids_ages: { type: Number },
    hotel: { type: String },
    dates: { type: [Date] },
    out_date: { type: Date },
    roomId: { type: String },
    room_type: { type: String },
    status: { type: String },
    notes: { type: String },
    user: { type: String },
})

const bookingModel = mongoose.model("bookings", BookingsSchema)

export default bookingModel