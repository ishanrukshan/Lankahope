import mongoose from 'mongoose';

const boardMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    organization: { type: String },
    imagePath: { type: String },
    order: { type: Number, default: 0 }
}, {
    timestamps: true
});

const BoardMember = mongoose.model('BoardMember', boardMemberSchema);

export default BoardMember;
