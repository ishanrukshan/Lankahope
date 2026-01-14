import express from 'express';
import Event from '../models/Event.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({}).sort({ date: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create an event
// @route   POST /api/admin/events
// @access  Private/Admin
router.post('/', protect, admin, upload.single('flyerImage'), async (req, res) => {
    try {
        const { title, description, content, eventDate, type } = req.body;
        const flyerImagePath = req.file ? `/uploads/${req.file.filename}` : '';

        const event = new Event({
            title,
            description,
            content,
            eventDate,
            type,
            flyerImagePath,
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// @desc    Update an event
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('flyerImage'), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            // Only update if value is provided and not empty string
            if (req.body.title) event.title = req.body.title;
            if (req.body.description !== undefined) event.description = req.body.description;
            if (req.body.content !== undefined) event.content = req.body.content;
            if (req.body.eventDate) event.eventDate = req.body.eventDate;
            if (req.body.type) event.type = req.body.type;
            if (req.file) {
                event.flyerImagePath = `/uploads/${req.file.filename}`;
            }

            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

// @desc    Delete an event
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            await event.deleteOne();
            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
