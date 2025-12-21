import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    title: { type: String, default: 'Untitled' },
    category: { type: String, default: 'General' },
    imagePath: { type: String, required: true },
}, {
    timestamps: true
});

const GalleryItem = mongoose.model('GalleryItem', gallerySchema);

export default GalleryItem;
