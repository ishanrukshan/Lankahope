import express from 'express';
import SiteImage from '../models/SiteImage.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload, { cloudinary } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @desc    Get all images
// @route   GET /api/images
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const { pageId, category } = req.query;
        const query = { isActive: true };

        if (pageId) query.pageId = pageId;
        if (category) query.category = category;

        const images = await SiteImage.find(query)
            .sort({ createdAt: -1 })
            .populate('uploadedBy', 'name email')
            .lean();

        res.json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Server error fetching images' });
    }
});

// @desc    Get public images for a page
// @route   GET /api/images/page/:pageId
// @access  Public
router.get('/page/:pageId', async (req, res) => {
    try {
        const images = await SiteImage.getImagesByPage(req.params.pageId);
        res.json(images);
    } catch (error) {
        console.error('Error fetching page images:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get image by name
// @route   GET /api/images/name/:name
// @access  Public
router.get('/name/:name', async (req, res) => {
    try {
        const image = await SiteImage.getImageByName(req.params.name);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.json(image);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Upload new image
// @route   POST /api/images
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const { name, pageId, sectionId, altText, description, category } = req.body;

        // Check if name already exists
        if (name) {
            const existing = await SiteImage.findOne({ name });
            if (existing) {
                return res.status(400).json({ message: 'Image with this name already exists' });
            }
        }

        // Cloudinary returns full URL in req.file.path
        const cloudinaryUrl = req.file.path;

        const image = new SiteImage({
            name: name || req.file.filename || `image-${Date.now()}`,
            originalName: req.file.originalname,
            filename: req.file.filename || req.file.public_id,
            path: cloudinaryUrl,
            url: cloudinaryUrl,
            pageId: pageId || null,
            sectionId: sectionId || null,
            altText: altText || '',
            description: description || '',
            category: category || 'other',
            size: req.file.size || 0,
            mimeType: req.file.mimetype || 'image/jpeg',
            uploadedBy: req.user._id
        });

        await image.save();
        res.status(201).json(image);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Server error uploading image' });
    }
});

// @desc    Upload multiple images
// @route   POST /api/images/bulk
// @access  Private/Admin
router.post('/bulk', protect, admin, upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No image files provided' });
        }

        const { pageId, category } = req.body;
        const uploadedImages = [];

        for (const file of req.files) {
            const image = new SiteImage({
                name: file.filename || `image-${Date.now()}`,
                originalName: file.originalname,
                filename: file.filename || file.public_id,
                path: file.path, // Cloudinary URL
                url: file.path,
                pageId: pageId || null,
                category: category || 'other',
                size: file.size || 0,
                mimeType: file.mimetype || 'image/jpeg',
                uploadedBy: req.user._id
            });

            await image.save();
            uploadedImages.push(image);
        }

        res.status(201).json(uploadedImages);
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Server error uploading images' });
    }
});

// @desc    Replace existing image
// @route   PUT /api/images/:id
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const image = await SiteImage.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Update metadata
        if (req.body.name) image.name = req.body.name;
        if (req.body.pageId !== undefined) image.pageId = req.body.pageId;
        if (req.body.sectionId !== undefined) image.sectionId = req.body.sectionId;
        if (req.body.altText !== undefined) image.altText = req.body.altText;
        if (req.body.description !== undefined) image.description = req.body.description;
        if (req.body.category) image.category = req.body.category;

        // Replace file if new one uploaded
        if (req.file) {
            // Delete old image from Cloudinary
            if (image.url && image.url.includes('cloudinary')) {
                try {
                    const publicId = image.url.split('/').slice(-2).join('/').split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error('Error deleting old Cloudinary image:', err);
                }
            }

            // Update with new Cloudinary URL
            image.originalName = req.file.originalname;
            image.filename = req.file.filename || req.file.public_id;
            image.path = req.file.path;
            image.url = req.file.path;
            image.size = req.file.size || 0;
            image.mimeType = req.file.mimetype || 'image/jpeg';
        }

        image.uploadedBy = req.user._id;
        await image.save();

        res.json(image);
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ message: 'Server error updating image' });
    }
});

// @desc    Delete image
// @route   DELETE /api/images/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const image = await SiteImage.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Delete from Cloudinary
        if (image.url && image.url.includes('cloudinary')) {
            try {
                const publicId = image.url.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error('Error deleting Cloudinary image:', err);
            }
        }

        await image.deleteOne();
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Server error deleting image' });
    }
});

// @desc    Get image categories
// @route   GET /api/images/categories/list
// @access  Private/Admin
router.get('/categories/list', protect, admin, async (req, res) => {
    try {
        const categories = ['hero', 'team', 'gallery', 'logo', 'background', 'content', 'other'];
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
