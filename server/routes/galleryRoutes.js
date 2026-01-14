import express from 'express';
import GalleryItem from '../models/GalleryItem.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload, { cloudinary } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Helper function to extract Cloudinary public_id from URL
const getCloudinaryPublicId = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    try {
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex === -1) return null;
        const pathParts = parts.slice(uploadIndex + 2);
        const publicId = pathParts.join('/').replace(/\.[^/.]+$/, '');
        return publicId;
    } catch (e) {
        console.error('Error extracting Cloudinary public_id:', e);
        return null;
    }
};

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
router.get('/', async (req, res) => {
    try {
        const items = await GalleryItem.find({}).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        console.error('Error fetching gallery:', error.message || error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a gallery item
// @route   POST /api/gallery
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { title, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const imagePath = req.file.path || req.file.secure_url || '';
        console.log('Gallery image uploaded:', imagePath);

        const item = new GalleryItem({
            title: title || 'Untitled',
            category: category || 'General',
            imagePath
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        console.error('Error creating gallery item:', error.message || JSON.stringify(error));
        res.status(400).json({ message: error.message || 'Invalid data' });
    }
});

// @desc    Bulk upload gallery items (multiple images at once)
// @route   POST /api/gallery/bulk
// @access  Private/Admin
router.post('/bulk', protect, admin, upload.array('images', 20), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one image' });
        }

        console.log('Bulk upload received:', req.files.length, 'files');

        const items = req.files.map(file => ({
            title: file.originalname ? file.originalname.replace(/\.[^/.]+$/, '') : 'Untitled',
            category: req.body.category || 'General',
            imagePath: file.path || file.secure_url || ''
        }));

        const createdItems = await GalleryItem.insertMany(items);
        res.status(201).json({
            message: `${createdItems.length} images uploaded successfully`,
            count: createdItems.length,
            items: createdItems
        });
    } catch (error) {
        console.error('Error in bulk upload:', error.message || JSON.stringify(error));
        res.status(400).json({ message: error.message || 'Bulk upload failed' });
    }
});

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const item = await GalleryItem.findById(req.params.id);

        if (item) {
            // Delete image from Cloudinary
            const publicId = getCloudinaryPublicId(item.imagePath);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log('Deleted gallery image from Cloudinary:', publicId);
                } catch (err) {
                    console.error('Error deleting Cloudinary image:', err.message);
                }
            }

            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        console.error('Error deleting gallery item:', error.message || JSON.stringify(error));
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
