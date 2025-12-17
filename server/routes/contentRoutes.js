import express from 'express';
import PageContent from '../models/PageContent.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get available pages and sections structure (MUST BE BEFORE /:pageId)
// @route   GET /api/content/structure/all
// @access  Public (structure definition is not sensitive)
router.get('/structure/all', async (req, res) => {
    try {
        const structure = {
            home: {
                name: 'Home Page',
                sections: {
                    hero: { 
                        name: 'Hero Section', 
                        fields: ['tagline', 'title', 'titleHighlight', 'description', 'button1Text', 'button2Text'] 
                    },
                    commitment: { 
                        name: 'Commitment Section', 
                        fields: ['greeting', 'title', 'description'] 
                    },
                    chairman: { 
                        name: "Chairman's Message", 
                        fields: ['sectionTitle', 'heading', 'quote', 'message', 'name', 'title'] 
                    },
                    pillars: { 
                        name: 'Pillars Section', 
                        fields: ['sectionTitle', 'heading'] 
                    },
                    vision: {
                        name: 'Vision Pillar',
                        fields: ['title', 'description']
                    },
                    mission: {
                        name: 'Mission Pillar',
                        fields: ['title', 'description']
                    },
                    values: {
                        name: 'Values Pillar',
                        fields: ['title', 'value1', 'value2', 'value3', 'value4']
                    },
                    goals: {
                        name: 'Goals Pillar',
                        fields: ['title', 'goal1', 'goal2', 'goal3', 'goal4']
                    }
                }
            },
            'about-background': {
                name: 'About - Background',
                sections: {
                    intro: { name: 'Introduction', fields: ['title', 'description'] },
                    vision: { name: 'Vision', fields: ['title', 'description'] },
                    mission: { name: 'Mission', fields: ['title', 'description'] },
                    values: { name: 'Core Values', fields: ['title', 'value1', 'value2', 'value3', 'value4', 'value5'] },
                    mandate: { name: 'Mandate', fields: ['title', 'description'] },
                    legacy: { name: 'Legacy', fields: ['title', 'description', 'stat1Value', 'stat1Label', 'stat2Value', 'stat2Label', 'stat3Value', 'stat3Label', 'stat4Value', 'stat4Label'] }
                }
            },
            'about-administration': {
                name: 'About - Administration',
                sections: {
                    intro: { name: 'Introduction', fields: ['title', 'description'] },
                    hierarchy: { name: 'Organizational Hierarchy', fields: ['directorGeneralName', 'directorGeneralDesc'] },
                    governance: { name: 'Governance', fields: ['title', 'description'] }
                }
            },
            'about-research': {
                name: 'About - Research Institutions',
                sections: {
                    intro: { name: 'Introduction', fields: ['title', 'description'] },
                    collaboration: { name: 'Collaboration', fields: ['title', 'description'] }
                }
            },
            'about-team': {
                name: 'About - Our Team',
                sections: {
                    intro: { name: 'Introduction', fields: ['title', 'description'] },
                    join: { name: 'Join Us', fields: ['title', 'description'] }
                }
            },
            'about-board': {
                name: 'About - Board/Committee',
                sections: {
                    intro: { name: 'Introduction', fields: ['title', 'description'] }
                }
            },
            contact: {
                name: 'Contact Page',
                sections: {
                    intro: { name: 'Introduction', fields: ['title', 'description'] },
                    info: { name: 'Contact Info', fields: ['address', 'phone', 'email', 'hours'] }
                }
            }
        };
        
        res.json(structure);
    } catch (error) {
        console.error('Error fetching structure:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get all content for a specific page
// @route   GET /api/content/:pageId
// @access  Public
router.get('/:pageId', async (req, res) => {
    try {
        const { pageId } = req.params;
        const content = await PageContent.getPageContent(pageId);
        res.json(content);
    } catch (error) {
        console.error('Error fetching page content:', error);
        res.status(500).json({ message: 'Server error fetching content' });
    }
});

// @desc    Get all content for all pages (admin)
// @route   GET /api/content
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const allContent = await PageContent.find({}).sort({ pageId: 1, sectionId: 1 }).lean();
        
        // Organize by page
        const organized = {};
        allContent.forEach(item => {
            if (!organized[item.pageId]) {
                organized[item.pageId] = {};
            }
            if (!organized[item.pageId][item.sectionId]) {
                organized[item.pageId][item.sectionId] = {};
            }
            organized[item.pageId][item.sectionId][item.contentKey] = {
                _id: item._id,
                content: item.content,
                contentType: item.contentType,
                updatedAt: item.updatedAt
            };
        });
        
        res.json(organized);
    } catch (error) {
        console.error('Error fetching all content:', error);
        res.status(500).json({ message: 'Server error fetching content' });
    }
});

// @desc    Get raw content list for a page (admin)
// @route   GET /api/content/:pageId/raw
// @access  Private/Admin
router.get('/:pageId/raw', protect, admin, async (req, res) => {
    try {
        const { pageId } = req.params;
        const content = await PageContent.find({ pageId }).sort({ sectionId: 1, order: 1 }).lean();
        res.json(content);
    } catch (error) {
        console.error('Error fetching raw content:', error);
        res.status(500).json({ message: 'Server error fetching content' });
    }
});

// @desc    Update or create content for a page section
// @route   PUT /api/content/:pageId/:sectionId/:contentKey
// @access  Private/Admin
router.put('/:pageId/:sectionId/:contentKey', protect, admin, async (req, res) => {
    try {
        const { pageId, sectionId, contentKey } = req.params;
        const { content, contentType } = req.body;
        
        const updated = await PageContent.findOneAndUpdate(
            { pageId, sectionId, contentKey },
            { 
                pageId, 
                sectionId, 
                contentKey, 
                content,
                contentType: contentType || 'text',
                updatedBy: req.user._id 
            },
            { upsert: true, new: true }
        );
        
        res.json(updated);
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({ message: 'Server error updating content' });
    }
});

// @desc    Bulk update content for a page
// @route   PUT /api/content/:pageId
// @access  Private/Admin
router.put('/:pageId', protect, admin, async (req, res) => {
    try {
        const { pageId } = req.params;
        const { sections } = req.body;
        
        const updated = await PageContent.bulkUpdatePageContent(pageId, sections, req.user._id);
        res.json(updated);
    } catch (error) {
        console.error('Error bulk updating content:', error);
        res.status(500).json({ message: 'Server error updating content' });
    }
});

// @desc    Delete content item
// @route   DELETE /api/content/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const content = await PageContent.findById(req.params.id);
        
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        
        await content.deleteOne();
        res.json({ message: 'Content deleted' });
    } catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({ message: 'Server error deleting content' });
    }
});

export default router;
