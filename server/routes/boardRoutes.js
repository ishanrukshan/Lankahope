import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import BoardMember from '../models/BoardMember.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// @desc    Get all board members
// @route   GET /api/board
// @access  Public
router.get('/', async (req, res) => {
    try {
        const board = await BoardMember.find({}).sort({ order: 1 });
        res.json(board);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a board member
// @route   POST /api/board
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { name, role, organization, order } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

        const boardMember = new BoardMember({
            name,
            role,
            organization,
            order,
            imagePath,
        });

        const createdMember = await boardMember.save();
        res.status(201).json(createdMember);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// @desc    Update a board member
// @route   PUT /api/board/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const member = await BoardMember.findById(req.params.id);

        if (member) {
            member.name = req.body.name || member.name;
            member.role = req.body.role || member.role;
            member.organization = req.body.organization || member.organization;
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
            res.status(404).json({ message: 'Board member not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// @desc    Delete a board member
// @route   DELETE /api/board/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const member = await BoardMember.findById(req.params.id);

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
            res.json({ message: 'Board member removed' });
        } else {
            res.status(404).json({ message: 'Board member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
