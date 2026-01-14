import express from 'express';
import TeamMember from '../models/TeamMember.js';
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

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
router.get('/', async (req, res) => {
    try {
        const team = await TeamMember.find({}).sort({ order: 1 });
        res.json(team);
    } catch (error) {
        console.error('Error fetching team:', error.message || error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a team member
// @route   POST /api/admin/team
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { name, title, bio, order } = req.body;

        let imagePath = '';
        if (req.file) {
            imagePath = req.file.path || req.file.secure_url || '';
            console.log('Team image uploaded:', imagePath);
        }

        const teamMember = new TeamMember({
            name,
            title,
            bio,
            order: order || 0,
            imagePath,
        });

        const createdMember = await teamMember.save();
        res.status(201).json(createdMember);
    } catch (error) {
        console.error('Error creating team member:', error.message || JSON.stringify(error));
        res.status(400).json({ message: error.message || 'Invalid data' });
    }
});

// @desc    Update a team member
// @route   PUT /api/admin/team/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);

        if (member) {
            if (req.body.name) member.name = req.body.name;
            if (req.body.title) member.title = req.body.title;
            if (req.body.bio !== undefined) member.bio = req.body.bio;
            if (req.body.order !== undefined) member.order = req.body.order;

            if (req.file) {
                // Delete old image from Cloudinary
                const oldPublicId = getCloudinaryPublicId(member.imagePath);
                if (oldPublicId) {
                    try {
                        await cloudinary.uploader.destroy(oldPublicId);
                        console.log('Deleted old team image from Cloudinary:', oldPublicId);
                    } catch (err) {
                        console.error('Error deleting old Cloudinary image:', err.message);
                    }
                }
                member.imagePath = req.file.path || req.file.secure_url || '';
                console.log('Updated team image:', member.imagePath);
            }

            const updatedMember = await member.save();
            res.json(updatedMember);
        } else {
            res.status(404).json({ message: 'Team member not found' });
        }
    } catch (error) {
        console.error('Error updating team member:', error.message || JSON.stringify(error));
        res.status(400).json({ message: error.message || 'Invalid data' });
    }
});

// @desc    Delete a team member
// @route   DELETE /api/admin/team/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);

        if (member) {
            // Delete image from Cloudinary
            const publicId = getCloudinaryPublicId(member.imagePath);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log('Deleted team image from Cloudinary:', publicId);
                } catch (err) {
                    console.error('Error deleting Cloudinary image:', err.message);
                }
            }

            await member.deleteOne();
            res.json({ message: 'Team member removed' });
        } else {
            res.status(404).json({ message: 'Team member not found' });
        }
    } catch (error) {
        console.error('Error deleting team member:', error.message || JSON.stringify(error));
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
