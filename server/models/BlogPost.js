import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
    userId:{type: String, required: true},
    username: {type: String, required: true},
    name:{type: String, required: true},
    userPicturePath: {type: String, default: ""},
    title:{type: String, reqired: true},
    text:{type: String, required: true },
    picturePath:{ type: String, default: ""},
    likes: {type: Map, of: Boolean, default: {}},
    comments: {type: Array, default: []},

})

export default mongoose.model('BlogPost', BlogPostSchema)