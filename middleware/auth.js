const jwt = require('jsonwebtoken')

const auth = (req,res,next) => {
    try{
        const authHeader = req.headers['authorization'];
        if(!authHeader) return res.status(401).json({error : "Invalid Token"});

        const token = authHeader && authHeader.split(' ')[1];
        console.log({token : token})
        
        if(!token) return res.status(400).json({msg:"Invalid Authentication"})

        jwt.verify(token,process.env.JWT_Access_SECRET,(err,user)=>{
            if(err) return res.status(400).json({msg:"Unauthorized"});

            req.user = user
            next()
            
        })
    }
    catch(err){
        return res.status(500).json({msg:err.message})
    }
}

module.exports = auth;