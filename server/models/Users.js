import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picturePath: {type: String, default: ""},
    posts: {type: Number, default: 0},
    following: {type: Array, default: []},
    followers: {type: Array, default: []}

})

export default mongoose.model("users", UserSchema);