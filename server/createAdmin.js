import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import User from './models/User.js';

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdmin = async () => {
    try {
        console.log('\n========================================');
        console.log('       CREATE NEW ADMIN USER');
        console.log('========================================\n');

        // Get username
        const username = await question('Enter username: ');
        if (!username || username.trim().length < 3) {
            console.log('\n❌ Username must be at least 3 characters');
            rl.close();
            process.exit(1);
        }

        // Get password
        const password = await question('Enter password: ');
        if (!password || password.trim().length < 6) {
            console.log('\n❌ Password must be at least 6 characters');
            rl.close();
            process.exit(1);
        }

        // Confirm password
        const confirmPassword = await question('Confirm password: ');
        if (password !== confirmPassword) {
            console.log('\n❌ Passwords do not match');
            rl.close();
            process.exit(1);
        }

        rl.close();

        // Connect to database
        console.log('\n⏳ Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Check if username already exists
        const userExists = await User.findOne({ username: username.trim() });
        if (userExists) {
            console.log(`\n❌ User "${username}" already exists`);
            process.exit(1);
        }

        // Create admin user
        const user = await User.create({
            username: username.trim(),
            password: password, // This will be hashed by the pre-save hook in User model
            role: 'admin'
        });

        console.log('\n========================================');
        console.log('✅ ADMIN USER CREATED SUCCESSFULLY!');
        console.log('========================================');
        console.log(`   Username: ${username.trim()}`);
        console.log(`   Role: admin`);
        console.log('========================================\n');

        process.exit();
    } catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
