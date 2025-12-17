import mongoose from 'mongoose';

const pageContentSchema = new mongoose.Schema({
    pageId: {
        type: String,
        required: true,
        enum: ['home', 'about-background', 'about-administration', 'about-research', 'about-team', 'about-board', 'resources', 'symposium', 'news-events', 'contact'],
        index: true
    },
    sectionId: {
        type: String,
        required: true,
        index: true
    },
    contentKey: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        enum: ['text', 'html', 'markdown'],
        default: 'text'
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
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

// Compound index for efficient lookups
pageContentSchema.index({ pageId: 1, sectionId: 1, contentKey: 1 }, { unique: true });

// Static method to get all content for a page
pageContentSchema.statics.getPageContent = async function(pageId) {
    const contents = await this.find({ pageId, isActive: true }).lean();
    
    // Organize content by section
    const organized = {};
    contents.forEach(item => {
        if (!organized[item.sectionId]) {
            organized[item.sectionId] = {};
        }
        organized[item.sectionId][item.contentKey] = item.content;
    });
    
    return organized;
};

// Static method to update or create content
pageContentSchema.statics.upsertContent = async function(pageId, sectionId, contentKey, content, userId) {
    return this.findOneAndUpdate(
        { pageId, sectionId, contentKey },
        { 
            pageId, 
            sectionId, 
            contentKey, 
            content,
            updatedBy: userId 
        },
        { upsert: true, new: true }
    );
};

// Static method to bulk update page content
pageContentSchema.statics.bulkUpdatePageContent = async function(pageId, sections, userId) {
    const operations = [];
    
    for (const [sectionId, sectionContent] of Object.entries(sections)) {
        for (const [contentKey, content] of Object.entries(sectionContent)) {
            operations.push({
                updateOne: {
                    filter: { pageId, sectionId, contentKey },
                    update: { 
                        $set: { 
                            pageId, 
                            sectionId, 
                            contentKey, 
                            content,
                            updatedBy: userId,
                            updatedAt: new Date()
                        } 
                    },
                    upsert: true
                }
            });
        }
    }
    
    if (operations.length > 0) {
        await this.bulkWrite(operations);
    }
    
    return this.getPageContent(pageId);
};

const PageContent = mongoose.model('PageContent', pageContentSchema);

export default PageContent;
