const User = require('../models/userModel.js') 
const jwt =  require('jsonwebtoken')
const bcrypt = require('bcrypt');

const userCtrl = {
    // signup
    signup: async (req, res) => {
        try {
            // Initialize data from the request body
            const data = req.body;

            // Check if the user already exists based on the email
            const existingUser = await User.findOne({email: data.email});
            if (existingUser) {
                return res.status(400).json({ msg: "Email Already Registered" });
            }

            // Validate password length
            if (data.password.length < 5) {
                return res.status(400).json({ msg: "Password should contain at least 5 characters" });
            }

            // Create a new user and save it to the database
            const newUser = new User(data);
            const response = await newUser.save();

            //Create jwt to authenticate
            const accessToken = createAccessToken({id : newUser.id})
            const refreshToken = createRefreshToken({id : newUser.id})

            res.cookie('refreshToken',refreshToken,{
                httpOnly : true,
                path : '/user/refreshToken'
            })

            // Send a successful response
            res.status(200).json({response : response,accesstoken :accessToken});
        } catch (error) {
            // Handle any errors that occur
            console.log('Error saving data', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    // refreshToken 
    refreshToken : async(req,res)=>{
        try{
            const rf_token = req.cookies.refreshToken;

            if(!rf_token){
                return res.status(400).json({msg : "Please Login and Register"})
            }
            jwt.verify(rf_token,process.env.JWT_Refresh_SECRET,(err,user) =>{
                if(err) return res.status(400).json({msg:"Please Login or Register"})
                const accesstoken = createAccessToken({id:user.id})
                res.status(200).json({user,accesstoken})
            })
        }
        catch{
            console.log('Error saving data', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    // login
    login : async(req,res)=>{
        try{
            // Initialize data from the request body
            const {email,password} = req.body;

            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({msg : "User does not exist"})
            }

            // password Authentication
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(401).json({msg : "Invalid password"})
            }
            
            //jwt Authenticate
            const accessToken = createAccessToken({id : user.id})
            const refreshToken = createRefreshToken({id : user.id})

            res.cookie('refreshToken',refreshToken,{
                httpOnly : true,
                path : '/user/refreshToken'
            })

            res.status(200).json({msg : "Login success",accessToken : accessToken})
        }
        catch(error){
            console.log('Error saving data', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    //logout
    logout: async (req, res) => {
        try {
            // Clear the refresh token cookie
            res.clearCookie('refreshtoken', { path: '/user/refreshToken' });
            return res.json({ msg: "Logged Out" });
        } catch (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
    // get User Information
    getUser : async(req,res)=>{
        try{
            const user = await User.findById(req.user.id).select('-password')

            if(!user){
                return res.status(400).json({msg : "User Not Found"})
            }
            res.json(user)
        }
        catch(error){
            console.log('Error showing data', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const  createAccessToken = (payload)=>{
    return jwt.sign(payload,process.env.JWT_Access_SECRET,{expiresIn : '1d'})
}

const createRefreshToken = (payload)=>{
    return jwt.sign(payload,process.env.JWT_Refresh_SECRET,{expiresIn : '7d'})
}

module.exports = userCtrl;