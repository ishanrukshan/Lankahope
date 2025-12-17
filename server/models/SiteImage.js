import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteImageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    originalName: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    pageId: {
        type: String,
        index: true
    },
    sectionId: {
        type: String
    },
    altText: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    size: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['hero', 'team', 'gallery', 'logo', 'background', 'content', 'other'],
        default: 'other'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Virtual for full URL
siteImageSchema.virtual('fullUrl').get(function() {
    return `${process.env.BASE_URL || 'http://localhost:5000'}${this.url}`;
});

// Pre-remove hook to delete file from filesystem
siteImageSchema.pre('remove', async function(next) {
    try {
        const filePath = path.join(__dirname, '..', this.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error('Error deleting image file:', error);
    }
    next();
});

// Static method to get images by page
siteImageSchema.statics.getImagesByPage = async function(pageId) {
    return this.find({ pageId, isActive: true }).lean();
};

// Static method to get image by name
siteImageSchema.statics.getImageByName = async function(name) {
    return this.findOne({ name, isActive: true }).lean();
};

// Static method to replace image
siteImageSchema.statics.replaceImage = async function(imageId, newFileData, userId) {
    const existingImage = await this.findById(imageId);
    
    if (existingImage) {
        // Delete old file
        try {
            const oldPath = path.join(__dirname, '..', existingImage.path);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        } catch (error) {
            console.error('Error deleting old image:', error);
        }
        
        // Update with new file data
        existingImage.originalName = newFileData.originalName;
        existingImage.filename = newFileData.filename;
        existingImage.path = newFileData.path;
        existingImage.url = newFileData.url;
        existingImage.size = newFileData.size;
        existingImage.mimeType = newFileData.mimeType;
        existingImage.width = newFileData.width;
        existingImage.height = newFileData.height;
        existingImage.uploadedBy = userId;
        
        return existingImage.save();
    }
    
    return null;
};

const SiteImage = mongoose.model('SiteImage', siteImageSchema);

export default SiteImage;
