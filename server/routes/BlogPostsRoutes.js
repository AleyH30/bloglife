import express from 'express';
import BlogPostsModel from '../models/BlogPost.js';
import UserModel from '../models/Users.js';
import DemoUserModel from '../models/DemoUsers.js';
import { VerifyToken } from './AuthRoutes.js';
import multer from 'multer';
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/assets");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage})

router.post('/upload', upload.single("file"), (req, res) => {
    console.log(req.file)
})

// Get all blog posts
router.get("/", async (req, res) => {
    try {
        const data = await BlogPostsModel.find({});

        if (!data) {
            throw new Error('An error occured while fetching blog posts.')
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error: 'An error occured while fetching blog posts...'})
    }
})

// Get blog posts of following
router.get("/getBlogPostsOfFollowing/:userId", async (req, res) => {
    try{
        const {userId} = req.params;
        const user = await UserModel.findById(userId);
        const demoUser = await DemoUserModel.findById(userId);

        const data = await BlogPostsModel.find({});
        if (!data) {
            throw new Error('An error occured while fetching blog posts.')
        }

        if(demoUser){
            const updatedData = data.filter((post) => demoUser.following.includes(post.userId))
            res.status(200).json(updatedData);
        }
        else{
            const updatedData = data.filter((post) => user.following.includes(post.userId))
            res.status(200).json(updatedData);
        }

    } catch (error){
        res.status(500).json({error: 'An error occured while fetching blog posts...'})
    }
})

// Get blog post by blog post id
router.get("/:id", async (req, res) => {
    try {
        const blogPostId = req.params.id;
        const data = await BlogPostsModel.findById(blogPostId);

        if(!data){
            throw new Error ('An error occurred while fetching blog post')
        }

        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({error: 'An error occurred while fetching blog post...'})
        
    }

})

// Create a blog post
router.post("/createBlogPost", VerifyToken, upload.single("file"), async (req, res) => {
    try {
        const {userId, title, text} = req.body
        const user = await UserModel.findById(userId);
        const demoUser = await DemoUserModel.findById(userId);

        if (demoUser){
            const data = await BlogPostsModel.create({
                userId: demoUser._id, username: demoUser.username, name: demoUser.name, userPicturePath: demoUser.picturePath,
                title, text, picturePath: req.file === undefined ? "" : req.file.filename
            });
            if (!data) {
                throw new Error('An error occurred while creating blog post')
            }
            res.status(200).json(data);

        }
        else{
            const data = await BlogPostsModel.create({
                userId: user._id, username: user.username, name: user.name, userPicturePath: user.picturePath,
                title, text, picturePath: req.file === undefined ? "" : req.file.filename
            });
            if (!data) {
                throw new Error('An error occurred while creating blog post')
            }
            res.status(200).json(data);
        }
        
    }
    catch (error) {
        console.log(error)
        res.status(500).json({error: 'An error occurred while creating blog post...'})
    }
})

// Update a blog post
router.put("/:id", VerifyToken, upload.single("file"), async (req, res) => {
    console.log(req.file)
    try {
        const blogPostId = req.params.id;
        const { title, text} = req.body;

        if (req.file === undefined) {
            const data = await BlogPostsModel.findByIdAndUpdate(blogPostId, { title, text });
            if (!data) {
                throw new Error('An error occurred while updating blog post')
            }
            res.status(200).json(data);
        }
        else {
            const data = await BlogPostsModel.findByIdAndUpdate(blogPostId, { title, text, picturePath: req.file.filename });
            if (!data) {
                throw new Error('An error occurred while updating blog post')
            }
            res.status(200).json(data);
        }
    }
    catch (error) {
        res.status(500).json({error: 'An error occurred while updating blog post...'})
        
    }
})

// Delete a blog post
router.delete("/:id", VerifyToken, async (req, res) => {
    try {
        const blogPostId = req.params.id;
        const data = await BlogPostsModel.findByIdAndDelete(blogPostId);

        if(!data){
            throw new Error ('An error occurred while deleting blog post')
        }

        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({error: 'An error occurred while deleting blog post...'})
        
    }
})

// Like a blog post
router.patch("/:id/like", VerifyToken, async (req, res) => {
    try{
        const {id} = req.params;
        const {userId} = req.body;
        const blogPost = await BlogPostsModel.findById(id)
        const isLiked = blogPost.likes.get(userId);

        if (isLiked){
            blogPost.likes.delete(userId);
        }
        else{
            blogPost.likes.set(userId, true)
        }
        const updatedPost = await BlogPostsModel.findByIdAndUpdate(id, {likes: blogPost.likes}, {new: true});
        console.log(updatedPost)

        res.status(200).json(updatedPost);
    }
    catch (error){
        res.status(404).json({message: error.message})
    }
})

export {router as blogPostsRouter}
