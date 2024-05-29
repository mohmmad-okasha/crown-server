import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String , unique: true },
    email: { type: String },
    password: { type: String },
    rules: { type: Object },
    active: { type: Boolean }
})

const userModel = mongoose.model("crown_users", UsersSchema)

export default userModel