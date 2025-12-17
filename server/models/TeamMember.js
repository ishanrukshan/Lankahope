import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    imagePath: { type: String }, // Stores filename handled by Multer
    bio: { type: String }, // For the "MORE" button content
    order: { type: Number, default: 0 } // For controlling display sequence
}, {
    timestamps: true
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
