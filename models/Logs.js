import mongoose from "mongoose";

const LogsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    log: { type: String },
    userName: { type: String },
    time: { type: Date },
})

const LogsModel = mongoose.model("logs", LogsSchema)

export default LogsModel