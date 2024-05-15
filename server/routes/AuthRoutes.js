import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/Users.js';
import DemoUserModel from '../models/DemoUsers.js'

const router = express.Router();

// Create a user
router.post("/register", async (req, res) => {
    const { fullname, email, username, password } = req.body;
    const user = await UserModel.findOne({username});

    if (user) {
        return res.json({success: false, errors: "User already exists."})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new UserModel({name: fullname, email, username, password: hashedPassword})
    await newUser.save()
    const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET);
    res.json({success: true, token, userId: newUser._id, username, message: "User Registered Successfully"})
});

// Create a demo user
router.post("/registerDemoUser", async (req, res) => {
    const { fullname, email, username, password, picturePath } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new DemoUserModel({name: fullname, email, username, password: hashedPassword, picturePath})
    await newUser.save()

    await Promise.all( newUser.following.map(async (follow) =>  {
        const user = await UserModel.findById(follow)
        const id = newUser._id.toString()
        user.followers.push(id)
        await user.save()
    }))
    await Promise.all( newUser.followers.map(async (follow) => {
        const user = await UserModel.findById(follow)
        const id = newUser._id.toString()
        user.following.push(id)
        await user.save()
    }))
    const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET);
    res.json({success: true, token, userId: newUser._id, username, message: "Demo User Registered Successfully"})
});

// Log user in
router.post("/login", async (req, res) => {
    try{
        const {email, username, password} = req.body;
        const user = await UserModel.findOne({username});

        if (!user) {
            return res.json({success: false, errors: "User doesn't exist."})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.json({success: false, errors: "Username or password is incorrect."})
        }

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        //delete user.password and user.email then just send user edroh55
        res.json({success: true, token, userId: user._id, username: user.username})
    }
    catch(error){
        console.log(error)
    }
    
})

export {router as authRouter};

export const VerifyToken = (req,res,next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
            if (err) return res.sendStatus(403);
            next();
        })
    }
    else{
        res.json({success: false, errors: "Not able to verify account."})
    }
}