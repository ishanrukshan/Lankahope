import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import GalleryItem from '../models/GalleryItem.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
router.get('/', async (req, res) => {
    try {
        const items = await GalleryItem.find({}).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
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

        const imagePath = `/uploads/${req.file.filename}`;

        const item = new GalleryItem({
            title: title || 'Untitled',
            category: category || 'General',
            imagePath
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid data' });
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

        const items = req.files.map(file => ({
            title: file.originalname.replace(/\.[^/.]+$/, ''), // Use filename as title
            category: req.body.category || 'General',
            imagePath: `/uploads/${file.filename}`
        }));

        const createdItems = await GalleryItem.insertMany(items);
        res.status(201).json({
            message: `${createdItems.length} images uploaded successfully`,
            count: createdItems.length,
            items: createdItems
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Bulk upload failed' });
    }
});

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const item = await GalleryItem.findById(req.params.id);

        if (item) {
            // Delete file from filesystem
            const filePath = path.join(__dirname, '..', item.imagePath);
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {
                console.error('Error deleting file:', err);
                // Continue with database deletion even if file is missing
            }

            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
