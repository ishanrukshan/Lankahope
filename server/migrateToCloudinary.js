/**
 * Migration Script: Upload old local images to Cloudinary
 * 
 * This script:
 * 1. Finds all images in server/uploads folder
 * 2. Uploads each to Cloudinary
 * 3. Updates MongoDB records with new Cloudinary URLs
 * 
 * Run with: node migrateToCloudinary.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Models
import GalleryItem from './models/GalleryItem.js';
import BoardMember from './models/BoardMember.js';
import TeamMember from './models/TeamMember.js';
import Event from './models/Event.js';
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

// Migrate Gallery Items
async function migrateGallery() {
    console.log('\n📸 Migrating Gallery Items...');
    const items = await GalleryItem.find({});
    let migrated = 0;

    for (const item of items) {
        if (isLocalPath(item.imagePath)) {
            const newUrl = await uploadToCloudinary(item.imagePath);
            if (newUrl) {
                item.imagePath = newUrl;
                await item.save();
                migrated++;
            }
        }
    }
    console.log(`   Gallery: ${migrated} images migrated`);
}

// Migrate Board Members
async function migrateBoard() {
    console.log('\n👥 Migrating Board Members...');
    const members = await BoardMember.find({});
    let migrated = 0;

    for (const member of members) {
        if (isLocalPath(member.imagePath)) {
            const newUrl = await uploadToCloudinary(member.imagePath);
            if (newUrl) {
                member.imagePath = newUrl;
                await member.save();
                migrated++;
            }
        }
    }
    console.log(`   Board: ${migrated} images migrated`);
}

// Migrate Team Members
async function migrateTeam() {
    console.log('\n🧑‍💼 Migrating Team Members...');
    const members = await TeamMember.find({});
    let migrated = 0;

    for (const member of members) {
        if (isLocalPath(member.imagePath)) {
            const newUrl = await uploadToCloudinary(member.imagePath);
            if (newUrl) {
                member.imagePath = newUrl;
                await member.save();
                migrated++;
            }
        }
    }
    console.log(`   Team: ${migrated} images migrated`);
}

// Migrate Events
async function migrateEvents() {
    console.log('\n📅 Migrating Events...');
    const events = await Event.find({});
    let migrated = 0;

    for (const event of events) {
        if (isLocalPath(event.flyerImagePath)) {
            const newUrl = await uploadToCloudinary(event.flyerImagePath);
            if (newUrl) {
                event.flyerImagePath = newUrl;
                await event.save();
                migrated++;
            }
        }
    }
    console.log(`   Events: ${migrated} images migrated`);
}

// Migrate Site Images (Hero, etc.)
async function migrateSiteImages() {
    console.log('\n🖼️ Migrating Site Images (Hero, Backgrounds, etc.)...');
    const images = await SiteImage.find({});
    let migrated = 0;

    for (const image of images) {
        // SiteImage has both 'path' and 'url' fields
        if (isLocalPath(image.path) || isLocalPath(image.url)) {
            const pathToUpload = image.path || image.url;
            const newUrl = await uploadToCloudinary(pathToUpload);
            if (newUrl) {
                image.path = newUrl;
                image.url = newUrl;
                await image.save();
                migrated++;
            }
        }
    }
    console.log(`   Site Images: ${migrated} images migrated`);
}

// Main function
async function main() {
    console.log('🚀 Starting Cloudinary Migration...\n');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

    await connectDB();

    await migrateGallery();
    await migrateBoard();
    await migrateTeam();
    await migrateEvents();
    await migrateSiteImages();

    console.log('\n✅ Migration Complete!');
    console.log('All local images have been uploaded to Cloudinary');
    console.log('and database records have been updated.');

    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
}

main().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
});
