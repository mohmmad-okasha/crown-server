import mongoose from "mongoose";

const HotelsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String , unique: true },
    country: { type: String },
    city: { type: String },
    area: { type: String },
    rate: { type: String },
    allotment: { type: Number },
    notes: { type: String },
    user: { type: String },
})

const hotelModel = mongoose.model("hotels", HotelsSchema)

export default hotelModel