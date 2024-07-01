import mongoose from "mongoose";

const RoomsSchema = new mongoose.Schema({
    hotelId: { type: String },// hotel _id
    roomId: { type: String },// room name
    roomType: { type: String },
    roomCateg: { type: String },
    meals: { type: String },
    persons: { type: Number },
    range:  {},
    notes: { type: String },
    user: { type: String },
})

const roomModel = mongoose.model("rooms", RoomsSchema)

export default roomModel