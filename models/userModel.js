const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true,
    },
    email:{
        type : String,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    role:{
        type : Number,
        default : 0,
    },
    cart : {
        type : Array,
        default : []
    }
},{
   timestamps : true
})

userSchema.pre('save', async function(next){
    const person = this;

    // Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();
    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);
        
        // Override the plain password with the hashed one
        person.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

// userSchema.methods.comparePassword = async function(candidatePassword){
//     const person = this;
//     try{
//         // Use bcrypt to compare the provided password with the hashed password
//         const isMatch = await bcrypt.compare(candidatePassword, person.password);
//         return isMatch;
//     }catch(error){
//         console.error('Error comparing password', error);
//         throw new Error('Error comparing password');
//     }
// }


const user = mongoose.model('user',userSchema);
module.exports = user;