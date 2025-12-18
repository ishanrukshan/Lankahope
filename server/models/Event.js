import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String }, // Full blog/article content
    eventDate: { type: Date },
    flyerImagePath: { type: String }, // Multer uploaded image
    type: { type: String, enum: ['NEWS', 'EVENT'], default: 'NEWS' }
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
