import mongoose from 'mongoose';

const DemoUserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    picturePath: {type: String, default: ""},
    posts: {type: Number, default: 0},
    following: {type: Array, default: ["661a03691f329294506d177e", "661a0088db113a215e395ec3", "661a034d1f329294506d177b"]},
    followers: {type: Array, default: ["661a03691f329294506d177e", 
    "661a0088db113a215e395ec3", 
    "661a034d1f329294506d177b", 
    "661a01961f329294506d1775",
    "661a031c1f329294506d1778",
    "662a1477f601ebc990c4d2a7",
    "662a1592f601ebc990c4d2b1",
]}

})

export default mongoose.model("demoUsers", DemoUserSchema);