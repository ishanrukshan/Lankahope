import express from 'express';
import BoardMember from '../models/BoardMember.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload, { cloudinary } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Helper function to extract Cloudinary public_id from URL
const getCloudinaryPublicId = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    try {
        // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/folder/filename.ext
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex === -1) return null;
        // Get everything after 'upload/v123/' (skip version)
        const pathParts = parts.slice(uploadIndex + 2); // Skip 'upload' and version
        const publicId = pathParts.join('/').replace(/\.[^/.]+$/, ''); // Remove extension
        return publicId;
    } catch (e) {
        console.error('Error extracting Cloudinary public_id:', e);
        return null;
    }
};

// @desc    Get all board members
// @route   GET /api/board
// @access  Public
router.get('/', async (req, res) => {
    try {
        const board = await BoardMember.find({}).sort({ order: 1 });
        res.json(board);
    } catch (error) {
        console.error('Error fetching board:', error.message || error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a board member
// @route   POST /api/board
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { name, role, organization, order } = req.body;

        // Cloudinary returns full URL in req.file.path
        let imagePath = '';
        if (req.file) {
            imagePath = req.file.path || req.file.secure_url || '';
            console.log('Cloudinary upload successful:', imagePath);
        }

        const boardMember = new BoardMember({
            name,
            role,
            organization,
            order: order || 0,
            imagePath,
        });

        const createdMember = await boardMember.save();
        res.status(201).json(createdMember);
    } catch (error) {
        console.error('Error creating board member:', error.message || JSON.stringify(error));
        res.status(400).json({ message: error.message || 'Invalid data' });
    }
});

// @desc    Update a board member
// @route   PUT /api/board/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const member = await BoardMember.findById(req.params.id);

        if (member) {
            if (req.body.name) member.name = req.body.name;
            if (req.body.role) member.role = req.body.role;
            if (req.body.organization !== undefined) member.organization = req.body.organization;
            if (req.body.order !== undefined) member.order = req.body.order;

            // If new file uploaded, delete old from Cloudinary and update path
            if (req.file) {
                // Delete old image from Cloudinary
                const oldPublicId = getCloudinaryPublicId(member.imagePath);
                if (oldPublicId) {
                    try {
                        await cloudinary.uploader.destroy(oldPublicId);
                        console.log('Deleted old image from Cloudinary:', oldPublicId);
                    } catch (err) {
                        console.error('Error deleting old Cloudinary image:', err.message);
                    }
                }
                member.imagePath = req.file.path || req.file.secure_url || '';
                console.log('Updated image:', member.imagePath);
            }

            const updatedMember = await member.save();
            res.json(updatedMember);
        } else {
            res.status(404).json({ message: 'Board member not found' });
        }
    } catch (error) {
        console.error('Error updating board member:', error.message || JSON.stringify(error));
        res.status(400).json({ message: error.message || 'Invalid data' });
    }
});

// @desc    Delete a board member
// @route   DELETE /api/board/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const member = await BoardMember.findById(req.params.id);

        if (member) {
            // Delete image from Cloudinary
            const publicId = getCloudinaryPublicId(member.imagePath);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log('Deleted image from Cloudinary:', publicId);
                } catch (err) {
                    console.error('Error deleting Cloudinary image:', err.message);
                    // Continue with database deletion even if Cloudinary fails
                }
            }

            await member.deleteOne();
            res.json({ message: 'Board member removed' });
        } else {
            res.status(404).json({ message: 'Board member not found' });
        }
    } catch (error) {
        console.error('Error deleting board member:', error.message || JSON.stringify(error));
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
