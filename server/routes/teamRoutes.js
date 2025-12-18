import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import TeamMember from '../models/TeamMember.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
router.get('/', async (req, res) => {
    try {
        const team = await TeamMember.find({}).sort({ order: 1 });
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a team member
// @route   POST /api/admin/team
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { name, title, bio, order } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

        const teamMember = new TeamMember({
            name,
            title,
            bio,
            order,
            imagePath,
        });

        const createdMember = await teamMember.save();
        res.status(201).json(createdMember);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// @desc    Update a team member
// @route   PUT /api/admin/team/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);

        if (member) {
            member.name = req.body.name || member.name;
            member.title = req.body.title || member.title;
            member.bio = req.body.bio || member.bio;
            member.order = req.body.order || member.order;

            // If new file uploaded, delete old file
            if (req.file) {
                // Delete old image file if exists
                if (member.imagePath) {
                    const oldFilePath = path.join(__dirname, '..', member.imagePath);
                    try {
                        if (fs.existsSync(oldFilePath)) {
                            fs.unlinkSync(oldFilePath);
                        }
                    } catch (err) {
                        console.error('Error deleting old file:', err);
                    }
                }
                member.imagePath = `/uploads/${req.file.filename}`;
            }

            const updatedMember = await member.save();
            res.json(updatedMember);
        } else {
            res.status(404).json({ message: 'Team member not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// @desc    Delete a team member
// @route   DELETE /api/admin/team/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);

        if (member) {
            // Delete file from filesystem if exists
            if (member.imagePath) {
                const filePath = path.join(__dirname, '..', member.imagePath);
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                } catch (err) {
                    console.error('Error deleting file:', err);
                    // Continue with database deletion
                }
            }

            await member.deleteOne();
            res.json({ message: 'Team member removed' });
        } else {
            res.status(404).json({ message: 'Team member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
