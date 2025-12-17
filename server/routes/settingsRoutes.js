import express from 'express';
import SiteSettings from '../models/SiteSettings.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all public settings (flat)
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res) => {
    try {
        const settings = await SiteSettings.getSettingsFlat();
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server error fetching settings' });
    }
});

// @desc    Get all settings organized by category (admin)
// @route   GET /api/settings/all
// @access  Private/Admin
router.get('/all', protect, admin, async (req, res) => {
    try {
        const settings = await SiteSettings.find({}).sort({ category: 1, order: 1 }).lean();
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server error fetching settings' });
    }
});

// @desc    Get settings by category
// @route   GET /api/settings/category/:category
// @access  Private/Admin
router.get('/category/:category', protect, admin, async (req, res) => {
    try {
        const settings = await SiteSettings.find({ category: req.params.category })
            .sort('order')
            .lean();
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get single setting by key
// @route   GET /api/settings/key/:key
// @access  Public
router.get('/key/:key', async (req, res) => {
    try {
        const value = await SiteSettings.getSetting(req.params.key);
        if (value === null) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        res.json({ key: req.params.key, value });
    } catch (error) {
        console.error('Error fetching setting:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update single setting
// @route   PUT /api/settings/key/:key
// @access  Private/Admin
router.put('/key/:key', protect, admin, async (req, res) => {
    try {
        const { value } = req.body;
        
        const setting = await SiteSettings.findOneAndUpdate(
            { key: req.params.key },
            { value, updatedBy: req.user._id },
            { new: true }
        );
        
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        
        res.json(setting);
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({ message: 'Server error updating setting' });
    }
});

// @desc    Bulk update settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
    try {
        const { settings } = req.body;
        
        if (!settings || typeof settings !== 'object') {
            return res.status(400).json({ message: 'Invalid settings data' });
        }
        
        const updated = await SiteSettings.bulkUpdateSettings(settings, req.user._id);
        res.json(updated);
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Server error updating settings' });
    }
});

// @desc    Create new setting (admin)
// @route   POST /api/settings
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { key, value, type, category, label, description } = req.body;
        
        // Check if setting already exists
        const existing = await SiteSettings.findOne({ key });
        if (existing) {
            return res.status(400).json({ message: 'Setting with this key already exists' });
        }
        
        const setting = new SiteSettings({
            key,
            value,
            type: type || 'text',
            category: category || 'general',
            label: label || key,
            description: description || '',
            updatedBy: req.user._id
        });
        
        await setting.save();
        res.status(201).json(setting);
    } catch (error) {
        console.error('Error creating setting:', error);
        res.status(500).json({ message: 'Server error creating setting' });
    }
});

// @desc    Delete setting (admin)
// @route   DELETE /api/settings/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const setting = await SiteSettings.findById(req.params.id);
        
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        
        if (!setting.isEditable) {
            return res.status(403).json({ message: 'This setting cannot be deleted' });
        }
        
        await setting.deleteOne();
        res.json({ message: 'Setting deleted' });
    } catch (error) {
        console.error('Error deleting setting:', error);
        res.status(500).json({ message: 'Server error deleting setting' });
    }
});

// @desc    Initialize default settings
// @route   POST /api/settings/initialize
// @access  Private/Admin
router.post('/initialize', protect, admin, async (req, res) => {
    try {
        await SiteSettings.initializeDefaults();
        const settings = await SiteSettings.find({}).sort({ category: 1, order: 1 }).lean();
        res.json({ message: 'Settings initialized', settings });
    } catch (error) {
        console.error('Error initializing settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
