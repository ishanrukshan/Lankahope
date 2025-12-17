import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'email', 'phone', 'url', 'boolean', 'number', 'json', 'color'],
        default: 'text'
    },
    category: {
        type: String,
        enum: ['general', 'contact', 'social', 'footer', 'seo', 'appearance'],
        default: 'general'
    },
    label: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    },
    isEditable: {
        type: Boolean,
        default: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Static method to get all settings
siteSettingsSchema.statics.getAllSettings = async function() {
    const settings = await this.find({}).sort('order').lean();
    
    // Organize by category
    const organized = {};
    settings.forEach(setting => {
        if (!organized[setting.category]) {
            organized[setting.category] = {};
        }
        organized[setting.category][setting.key] = setting.value;
    });
    
    return organized;
};

// Static method to get settings as flat object
siteSettingsSchema.statics.getSettingsFlat = async function() {
    const settings = await this.find({}).lean();
    const flat = {};
    settings.forEach(setting => {
        flat[setting.key] = setting.value;
    });
    return flat;
};

// Static method to get setting by key
siteSettingsSchema.statics.getSetting = async function(key) {
    const setting = await this.findOne({ key }).lean();
    return setting ? setting.value : null;
};

// Static method to update setting
siteSettingsSchema.statics.updateSetting = async function(key, value, userId) {
    return this.findOneAndUpdate(
        { key },
        { value, updatedBy: userId },
        { new: true }
    );
};

// Static method to bulk update settings
siteSettingsSchema.statics.bulkUpdateSettings = async function(settings, userId) {
    const operations = Object.entries(settings).map(([key, value]) => ({
        updateOne: {
            filter: { key },
            update: { $set: { value, updatedBy: userId, updatedAt: new Date() } }
        }
    }));
    
    if (operations.length > 0) {
        await this.bulkWrite(operations);
    }
    
    return this.getSettingsFlat();
};

// Static method to initialize default settings
siteSettingsSchema.statics.initializeDefaults = async function() {
    const defaults = [
        // General
        { key: 'siteName', value: 'LankaHope', type: 'text', category: 'general', label: 'Site Name', order: 1 },
        { key: 'siteTagline', value: 'Empowering Health Research', type: 'text', category: 'general', label: 'Site Tagline', order: 2 },
        { key: 'logoUrl', value: '', type: 'image', category: 'general', label: 'Logo Image', order: 3 },
        
        // Contact
        { key: 'contactEmail', value: 'info@lankahope.lk', type: 'email', category: 'contact', label: 'Contact Email', order: 1 },
        { key: 'contactPhone', value: '+94 11 269 3456', type: 'phone', category: 'contact', label: 'Contact Phone', order: 2 },
        { key: 'contactAddress', value: 'No. 123, Norris Canal Road, Colombo 10, Sri Lanka', type: 'text', category: 'contact', label: 'Address', order: 3 },
        
        // Social
        { key: 'facebookUrl', value: '', type: 'url', category: 'social', label: 'Facebook URL', order: 1 },
        { key: 'twitterUrl', value: '', type: 'url', category: 'social', label: 'Twitter URL', order: 2 },
        { key: 'linkedinUrl', value: '', type: 'url', category: 'social', label: 'LinkedIn URL', order: 3 },
        { key: 'youtubeUrl', value: '', type: 'url', category: 'social', label: 'YouTube URL', order: 4 },
        
        // Footer
        { key: 'footerText', value: 'LankaHope is dedicated to promoting health research.', type: 'text', category: 'footer', label: 'Footer Description', order: 1 },
        { key: 'copyrightText', value: 'LankaHope. All Rights Reserved.', type: 'text', category: 'footer', label: 'Copyright Text', order: 2 },
        
        // SEO
        { key: 'metaDescription', value: 'LankaHope - National Health Research Organisation', type: 'text', category: 'seo', label: 'Meta Description', order: 1 },
        { key: 'metaKeywords', value: 'health research, Sri Lanka, medical research', type: 'text', category: 'seo', label: 'Meta Keywords', order: 2 },
        
        // Appearance
        { key: 'primaryColor', value: '#722F37', type: 'color', category: 'appearance', label: 'Primary Color (Maroon)', order: 1 },
        { key: 'secondaryColor', value: '#D4AF37', type: 'color', category: 'appearance', label: 'Secondary Color (Gold)', order: 2 },
    ];
    
    for (const setting of defaults) {
        await this.findOneAndUpdate(
            { key: setting.key },
            { $setOnInsert: setting },
            { upsert: true }
        );
    }
};

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;
