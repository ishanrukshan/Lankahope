import express from 'express';
import Event from '../models/Event.js';
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

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({}).sort({ date: -1 });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error.message || error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create an event
// @route   POST /api/admin/events
// @access  Private/Admin
router.post('/', protect, admin, upload.single('flyerImage'), async (req, res) => {
    try {
        const { title, description, content, eventDate, type } = req.body;

        let flyerImagePath = '';
        if (req.file) {
            flyerImagePath = req.file.path || req.file.secure_url || '';
            console.log('Event image uploaded:', flyerImagePath);
        }

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
        console.error('Error creating event:', error.message || JSON.stringify(error));
        res.status(400).json({ message: error.message || 'Invalid data' });
    }
});

// @desc    Update an event
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('flyerImage'), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            if (req.body.title) event.title = req.body.title;
            if (req.body.description !== undefined) event.description = req.body.description;
            if (req.body.content !== undefined) event.content = req.body.content;
            if (req.body.eventDate) event.eventDate = req.body.eventDate;
            if (req.body.type) event.type = req.body.type;

            if (req.file) {
                // Delete old image from Cloudinary
                const oldPublicId = getCloudinaryPublicId(event.flyerImagePath);
                if (oldPublicId) {
                    try {
                        await cloudinary.uploader.destroy(oldPublicId);
                        console.log('Deleted old event image from Cloudinary:', oldPublicId);
                    } catch (err) {
                        console.error('Error deleting old Cloudinary image:', err.message);
                    }
                }
                event.flyerImagePath = req.file.path || req.file.secure_url || '';
                console.log('Updated event image:', event.flyerImagePath);
            }

            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error('Error updating event:', error.message || JSON.stringify(error));
        res.status(400).json({ message: error.message || 'Invalid data' });
    }
});

// @desc    Delete an event
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            // Delete image from Cloudinary
            const publicId = getCloudinaryPublicId(event.flyerImagePath);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log('Deleted event image from Cloudinary:', publicId);
                } catch (err) {
                    console.error('Error deleting Cloudinary image:', err.message);
                }
            }

            await event.deleteOne();
            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error('Error deleting event:', error.message || JSON.stringify(error));
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
