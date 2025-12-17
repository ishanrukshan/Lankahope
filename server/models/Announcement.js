import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    text: { type: String, required: true },
    link: { type: String, required: true }
}, {
    timestamps: true
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
