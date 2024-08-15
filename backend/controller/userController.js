import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mail/emails.js";
import crypto from 'crypto';
import dotenv from "dotenv";

dotenv.config();

// signup 
export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const userAlready = await User.findOne({ email });

        if (userAlready) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds for security
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        await user.save();

        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.error("Error in signup: ", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// email verify 
export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        console.error("Error in verifyEmail: ", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// login 
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.error('Error in login: ', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// logout 
export const logout = async (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ success: true, message: "Successfully logged out" });
};

// forgot password 
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

   
        // Send email
        // const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

        await sendPasswordResetEmail(user.email, `http://localhost:5173/reset-password/${resetToken}`);
        await user.save();
        return res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.error("Error in forgotPassword: ", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// reset the password 
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds for security

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        return res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.error("Error in resetPassword: ", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



// auth user  


export const checkAuth = async(req , res)=>{
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user) {
            return res.status(400).json({ success: false, message: "User not found"})
        }
        res.status(200).json({success:true, user});
    } catch (error) {
        console.log("Error in checkAuth :", error);
        res.status(400).json({success:false , message: error.message});        
    }
}