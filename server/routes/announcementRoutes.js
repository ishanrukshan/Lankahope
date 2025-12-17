import express from 'express';
import Announcement from '../models/Announcement.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find({}).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create an announcement
// @route   POST /api/admin/announcements
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { text, link } = req.body;

        const announcement = new Announcement({
            text,
            link,
        });

        const createdAnnouncement = await announcement.save();
        res.status(201).json(createdAnnouncement);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// @desc    Update an announcement
// @route   PUT /api/admin/announcements/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (announcement) {
            announcement.text = req.body.text || announcement.text;
            announcement.link = req.body.link || announcement.link;

            const updatedAnnouncement = await announcement.save();
            res.json(updatedAnnouncement);
        } else {
            res.status(404).json({ message: 'Announcement not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// @desc    Delete an announcement
// @route   DELETE /api/admin/announcements/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (announcement) {
            await announcement.deleteOne();
            res.json({ message: 'Announcement removed' });
        } else {
            res.status(404).json({ message: 'Announcement not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
