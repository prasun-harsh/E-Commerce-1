const User = require('../models/userModel')

const authAdmin = async(req,res,next)=>{
    try{
        const user = await User.findOne({
            id : req.user.id
        })
        if(user.role === 0){
            return res.status(400).json({msg : 'Admin resources Access Denied'})
        }
        next();
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = authAdmin;