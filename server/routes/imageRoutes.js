import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import SiteImage from '../models/SiteImage.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'images');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

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
                // Delete uploaded file
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ message: 'Image with this name already exists' });
            }
        }
        
        const image = new SiteImage({
            name: name || req.file.filename.split('.')[0],
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: `/uploads/images/${req.file.filename}`,
            url: `/uploads/images/${req.file.filename}`,
            pageId: pageId || null,
            sectionId: sectionId || null,
            altText: altText || '',
            description: description || '',
            category: category || 'other',
            size: req.file.size,
            mimeType: req.file.mimetype,
            uploadedBy: req.user._id
        });
        
        await image.save();
        res.status(201).json(image);
    } catch (error) {
        console.error('Error uploading image:', error);
        // Clean up uploaded file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
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
                name: file.filename.split('.')[0],
                originalName: file.originalname,
                filename: file.filename,
                path: `/uploads/images/${file.filename}`,
                url: `/uploads/images/${file.filename}`,
                pageId: pageId || null,
                category: category || 'other',
                size: file.size,
                mimeType: file.mimetype,
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
            if (req.file) fs.unlinkSync(req.file.path);
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
            // Delete old file
            const oldPath = path.join(__dirname, '..', image.path);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
            
            // Update with new file info
            image.originalName = req.file.originalname;
            image.filename = req.file.filename;
            image.path = `/uploads/images/${req.file.filename}`;
            image.url = `/uploads/images/${req.file.filename}`;
            image.size = req.file.size;
            image.mimeType = req.file.mimetype;
        }
        
        image.uploadedBy = req.user._id;
        await image.save();
        
        res.json(image);
    } catch (error) {
        console.error('Error updating image:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
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
        
        // Delete file from filesystem
        const filePath = path.join(__dirname, '..', image.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
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
