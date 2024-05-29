import mongoose from "mongoose";

const RoomsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    hotel_id: { type: String },// hotel _id
    room_id: { type: String },// room name
    room_type: { type: String },
    room_categ: { type: String },
    meals: { type: String },
    persons: { type: Number },
    range: { type: String },
    notes: { type: String },
    user: { type: String },
})

const roomModel = mongoose.model("rooms", RoomsSchema)

export default roomModel