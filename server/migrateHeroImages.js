/**
 * Migration Script: Migrate ONLY Site Images (Hero Section) to Cloudinary
 * 
 * Run with: node migrateHeroImages.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import SiteImage from './models/SiteImage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
}

// Upload a local file to Cloudinary
async function uploadToCloudinary(localPath) {
    try {
        const fullPath = path.join(__dirname, localPath);

        if (!fs.existsSync(fullPath)) {
            console.log(`  ⚠️ File not found: ${fullPath}`);
            return null;
        }

        const result = await cloudinary.uploader.upload(fullPath, {
            folder: 'lankahope',
            quality: 'auto',
        });

        console.log(`  ✅ Uploaded: ${localPath} -> ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error(`  ❌ Error uploading ${localPath}:`, error.message);
        return null;
    }
}

// Check if path is a local path (not Cloudinary)
function isLocalPath(imagePath) {
    return imagePath &&
        imagePath.startsWith('/uploads') &&
        !imagePath.includes('cloudinary.com');
}

// Migrate Site Images (Hero, Backgrounds, etc.)
async function migrateSiteImages() {
    console.log('\n🖼️ Migrating Site Images (Hero, Backgrounds, etc.)...');
    const images = await SiteImage.find({});
    console.log(`   Found ${images.length} total site images in database`);

    let migrated = 0;
    let skipped = 0;

    for (const image of images) {
        // SiteImage has both 'path' and 'url' fields
        if (isLocalPath(image.path) || isLocalPath(image.url)) {
            const pathToUpload = image.path || image.url;
            console.log(`   Processing: ${pathToUpload}`);
            const newUrl = await uploadToCloudinary(pathToUpload);
            if (newUrl) {
                image.path = newUrl;
                image.url = newUrl;
                await image.save();
                migrated++;
            }
        } else {
            skipped++;
        }
    }

    console.log(`\n   ✅ Site Images: ${migrated} migrated, ${skipped} skipped (already on Cloudinary)`);
}

// Main function
async function main() {
    console.log('🚀 Starting Hero/Site Images Migration...\n');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

    await connectDB();
    await migrateSiteImages();

    console.log('\n✅ Migration Complete!');

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
}

main().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
});
