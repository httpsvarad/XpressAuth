import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import userModel from '../models/user.model.js';
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail } from '../emailJS/sendVerificationEmail.js';
import { sendPasswordResetEmail } from '../emailJS/sendPasswordResetEmail.js';
import { sendPasswordResetSuccessEmail } from '../emailJS/sendPasswordResetSuccessEmail.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/check-auth', verifyToken, async (req, res) => {
    try {
        // Ensure the token has been verified and userId is set in req
        const user = await userModel.findById(req.userId).select("-password");

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Send a successful response with user data
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error in check-auth route:", error);

        // Send a server error response
        res.status(500).json({
            success: false,
            message: "Please try again later.",
        });
    }
});

router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error('All fields are required');
        }
        const userAlreadyExist = await userModel.findOne({ email });
        if (userAlreadyExist) {
            throw new Error('User already exist, Try to login.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new userModel({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 HRS
        });

        await user.save();

        generateTokenAndSetCookie(res, user._id);

        res.status(200).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });

        await sendVerificationEmail(email, verificationToken);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.post('/verifyemail', async (req, res) => {
    const { code } = req.body;

    try {
        const user = await userModel.findOne({ verificationToken: code, verificationTokenExpiresAt: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Code is invalid or expired' });
        } else {
            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpiresAt = undefined;
            await user.save();
            res.status(200).json({
                success: true,
                message: 'User is verified',
                user: {
                    ...user._doc,
                    password: undefined,
                }
            });
        }
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Generate and set token as a cookie
            try {
                generateTokenAndSetCookie(res, user._id); // Ensure this function is implemented correctly

                // Update last login timestamp
                user.lastLogin = new Date();
                await user.save();

                // Send success response
                return res.status(200).json({
                    success: true,
                    message: 'User logged-in successfully',
                    user: {
                        ...user._doc,
                        password: undefined,
                    }
                });
            } catch (err) {
                // Handle any errors during token generation or database update
                console.error('Error during login:', err.message);
                return res.status(500).json({
                    success: false,
                    message: 'Error, Please try again !'
                });
            }
        } else {
            // Send response for invalid credentials
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (err) {
        // Catch any unexpected errors
        return res.status(500).json({
            success: false,
            message: 'Error, Please try again.'
        });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 Hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `http://localhost:3000/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: 'Password reset link sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error, Please try again.' });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await userModel.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }

        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        sendPasswordResetSuccessEmail(user.email);

        return res.status(200).json({ success: true, message: 'Password updated' });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Error, Please try again.' });
    }
});

router.post('/signout', (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: 'User logged-out successfully' });
});

export default router;
