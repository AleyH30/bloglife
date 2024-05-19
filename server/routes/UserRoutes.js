import express from 'express';
import UserModel from '../models/Users.js';
import DemoUserModel from '../models/DemoUsers.js';
import BlogPostsModel from '../models/BlogPost.js';
import { VerifyToken } from './AuthRoutes.js';

const router = express.Router();

//Get all users
router.get("/", async (req, res) => {
    try {
        const data = await UserModel.find({})
        if (!data) {
            throw new Error('An error occured while fetching blog posts.')
        }
        const formattedUsersArr = data.map(
            ({ _id, name, username, picturePath, followers, following}) => {
                return{_id, name, username, picturePath, followers, following}
            }
            )
        res.status(200).json(formattedUsersArr);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occured while fetching blog posts...' })
    }
})

// Get user by id
router.get("/:userId", async (req, res) =>{
    try {
        const {userId} = req.params;
        const user = await UserModel.findById(userId);
        const demoUser = await DemoUserModel.findById(userId)

        if (demoUser){
            res.status(200).json(demoUser);
        }
        else{
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(404).json({success: false, message: error.message});
    }
})

// Get user by username
router.get("/getUserByUsername/:username/", async (req, res) =>{
    try {
        const {username} = req.params;
        const user = await UserModel.findOne({username});
        res.status(200).json(user);
    }
    catch (error) {
        res.status(404).json({success: false, message: error.message});
    }
})

// Get all blog posts by userId
router.get("/getBlogPostsByUserId/:userId", async (req, res) => {
    try {
        const {userId} = req.params;
        const blogPosts = await BlogPostsModel.find({userId});
        res.json({success: true, blogPosts});
    }
    catch (error){
        res.json({success: false, errors: error.message})
    }

})

// Get all blog posts by username
router.get("/username/:username/blogposts", async (req, res) => {
    try {
        const {username} = req.params;
        const user = await UserModel.findOne({username});
        const blogPosts = await BlogPostsModel.find({username});
        res.json({success: true, blogPosts, userPicturePath: user.picturePath, userFullName: user.name});
    }
    catch (error){
        res.json({success: false, errors: error.message})
    }
})

// Get who user is following
router.get("/:userId/following", async (req, res) => {
    try{
        const { userId } = req.params;
        const user = await UserModel.findById(userId);
        const demoUser = await DemoUserModel.findById(userId);

        if(demoUser){
            const following = await Promise.all(
                demoUser.following.map((id) => UserModel.findById(id))
            )
            const formattedFollowing = following.map(
                ({ _id, name, username, picturePath, following, followers }) => {
                    return { _id, name, username, picturePath, following, followers }
                }
            )
            res.status(200).json(formattedFollowing)
        }
        else{
            const following = await Promise.all(
                user.following.map(async (id) => {
                    const user = await UserModel.findById(id)
                    const demoUser = await DemoUserModel.findById(id)

                    if (user){
                        return user
                    }
                    else if (demoUser){
                        return demoUser
                    }
                    else{
                        return null
                    }
                })
            )
            const filteredFollowing = following.filter(item => item !== null)
            const formattedFollowing = filteredFollowing.map(
                ({ _id, name, username, picturePath, following, followers }) => {
                    return { _id, name, username, picturePath, following, followers }
                }
            )
            res.status(200).json(formattedFollowing)
        }
        
    }
    catch (error) {
        res.status(404).json({message: error.message});
    }
})

// Get who follows user
router.get("/:userId/followers", async (req, res) => {
    try{
        const { userId } = req.params;
        const user = await UserModel.findById(userId);
        const demoUser = await DemoUserModel.findById(userId);

        if (demoUser){
            const followers = await Promise.all(
                demoUser.followers.map((id) => {
                    const demoUser = DemoUserModel.findById(id)
                    const user = UserModel.findById(id)

                    if (user){
                        return user
                    }
                    else if (demoUser){
                        return demoUser
                    }
                    else{
                        return null
                    }
                })
            )
            const filteredFollowers = followers.filter(item => item !== null)
            const formattedFollowers = filteredFollowers.map(
                ({ _id, name, username, picturePath, following, followers}) => {
                    return{_id, name, username, picturePath, following, followers}
                }
                )
            res.status(200).json({formattedFollowers, userfollowing: demoUser.following})

        }
        else{
            const followers = await Promise.all(
                user.followers.map(async (id) => {
                    const user = await UserModel.findById(id)
                    const demoUser = await DemoUserModel.findById(id)

                    if (user){
                        return user
                    }
                    else if (demoUser){
                        return demoUser
                    }
                    else{
                        return null
                    }
                })
            )
            const filteredFollowers = followers.filter(item => item !== null)

            const formattedFollowers = filteredFollowers.map(
                ({ _id, name, username, picturePath, following, followers }) => {
                    return { _id, name, username, picturePath, following, followers }
                }
            )
            res.status(200).json({formattedFollowers, userfollowing: user.following})
        }
    }
    catch (error) {
        res.status(404).json({message: error.message});
    }
})

//update and add to following list
router.patch("/:userId/following/:otherUserId", VerifyToken, async (req, res) => {
    try{
        const { userId, otherUserId } = req.params;
        const {action} = req.body;
        const user = await UserModel.findById(userId);
        const demoUser = await DemoUserModel.findById(userId);
        const otherUser = await UserModel.findById(otherUserId);
        const demoOtherUser = await DemoUserModel.findById(otherUserId);

        if (demoUser){
            if (action === "follow"){
                if (!demoUser.following.includes(otherUserId)) {
                     demoUser.following.push(otherUserId)
                     otherUser.followers.push(userId)
                 }
             }
             else if (action === "unfollow"){
                 if (demoUser.following.includes(otherUserId)) {
                     demoUser.following = demoUser.following.filter((id) => id !== otherUserId)
                     otherUser.followers = otherUser.followers.filter((id) => id !== userId)
                 }
             }
             
             await demoUser.save();
             await otherUser.save();
     
             const following = await Promise.all(
                 demoUser.following.map((id) => UserModel.findById(id))
             )
             const formattedFollowing = following.map(
                 ({ _id, name, username, picturePath}) => {
                     return{_id, name, username, picturePath}
                 }
                 )
             res.status(200).json(formattedFollowing)

        }
        else {
            if (action === "follow") {
                if (!user.following.includes(otherUserId)) {
                    user.following.push(otherUserId)
                    otherUser?.followers.push(userId)
                    demoOtherUser?.followers.push(userId)
                }
            }
            else if (action === "unfollow") {
                if (user.following.includes(otherUserId)) {
                    user.following = user.following.filter((id) => id !== otherUserId)
                    if(otherUser){
                        otherUser.followers = otherUser.followers.filter((id) => id !== userId)
                    }
                    else if (demoOtherUser){
                        demoOtherUser.followers = demoOtherUser.followers.filter((id) => id !== userId)
                    }
                }
            }

            await user.save();
            await otherUser?.save();
            await demoOtherUser?.save();

            const following = await Promise.all(
                user.following.map(async (id) => {
                    const user = await UserModel.findById(id)
                    const demoUser = await DemoUserModel.findById(id)

                    if (user){
                        return user
                    }
                    else if (demoUser){
                        return demoUser
                    }
                    else{
                        return null
                    }
                })
            )
            const filteredFollowing = following.filter(item => item !== null)
            const formattedFollowing = filteredFollowing.map(
                ({ _id, name, username, picturePath }) => {
                    return { _id, name, username, picturePath }
                }
            )
            res.status(200).json(formattedFollowing)
        }
    }
    catch (error) {
        console.log("update following list error")
        res.status(404).json({message: error.message});
    }
})

export {router as userRouter}

