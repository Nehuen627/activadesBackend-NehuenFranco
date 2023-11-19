import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String, 
    email: {
        type: String,
        unique: true,  
        sparse: true,  
    },
    age: Number,
    password: String, 
    rol: {type: String, default: "user"},
    provider: { type: String, default: "app" },
    githubId: { type: String, unique: true, sparse: true, default: null },
}, { timestamps: true });

export default mongoose.model('User', userSchema);