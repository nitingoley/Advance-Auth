import mongoose from "mongoose";



const userSchema = mongoose.Schema({
    email: {
        type:String ,
        required:true,
        unique : true,
    },
    password: {
        type:String ,
        required:true,
    },
    name: {
        type:String ,
        required:true,
    },
    lastLogin: {
       type: Date,
       default: Date.now
        // required:true,
    },
    isVerified: {
        type:Boolean,
        default : false
    },
    resetPasswordTokens: String,
    resetPasswordExpiresAt:Date ,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
},{timestamps: true}
);

const User = mongoose.model("User" , userSchema);


export default User;