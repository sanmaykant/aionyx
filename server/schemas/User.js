import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        googleId: { type: String, required: true, unique: true, },
        name: { type: String, required: true, trim: true, },
        email: { type: String, required: true,
            unique: true, lowercase: true, trim: true, },
        accessToken: { type: String },
        refreshToken: { type: String },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model('User', userSchema);
