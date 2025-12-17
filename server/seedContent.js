// Seed script to populate initial content matching the actual Home page
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PageContent from './models/PageContent.js';
import SiteSettings from './models/SiteSettings.js';
import connectDB from './config/db.js';

dotenv.config();

const seedContent = async () => {
    await connectDB();
    
    console.log('🌱 Seeding initial content...');
    
    // Clear existing content
    await PageContent.deleteMany({});
    console.log('🗑️ Cleared existing content');
    
    // Home page content - matches actual Home.jsx
    const homeContent = {
        hero: {
            tagline: 'The Pearl of the Indian Ocean',
            title: 'Empowering',
            titleHighlight: 'Generations',
            description: 'From the historic halls of BMICH to the tea hills of Nuwara Eliya, we are dedicated to preserving heritage and building a sustainable future.',
            button1Text: 'Discover Sri Lanka',
            button2Text: 'Support Us'
        },
        commitment: {
            greeting: '"ආයුබෝවන්"',
            title: 'A Commitment to Excellence',
            description: 'Since 2010, LankaHope has operated at the intersection of cultural preservation and community development. We believe that true progress honors the past while embracing the future. Guided by our core values of integrity, cultural respect, and community empowerment, we strive to build a resilient nation. Our goal is to expand our reach to every district, ensuring that our initiatives in healthcare, education, and heritage preservation touch the lives of millions, fostering sustainable growth and a brighter tomorrow for all Sri Lankans.'
        },
        chairman: {
            sectionTitle: "Chairman's Message",
            heading: 'Guiding the Nation Towards Healthier Horizons',
            quote: 'Our mission is not merely to construct buildings or fund research; it is to weave a fabric of resilience across Sri Lanka. Every initiative we undertake is a thread in that tapestry, connecting our proud heritage with a healthier, more prosperous future.',
            message: 'As we look forward, we remain steadfast in our commitment to transparency, excellence, and the unwavering belief that the health of our nation is the foundation of its strength.',
            name: 'Hon. Chairman Name',
            title: 'Chairman, LankaHope'
        },
        pillars: {
            sectionTitle: 'Our Foundation',
            heading: 'The Pillars of Our Purpose'
        },
        vision: {
            title: 'Vision',
            description: 'To be the beacon of hope and health for every Sri Lankan, preserving our rich heritage while pioneering a sustainable and prosperous future for generations to come.'
        },
        mission: {
            title: 'Mission',
            description: 'Empowering communities through holistic initiatives in healthcare, education, and cultural preservation, driven by transparency, integrity, and unwavering dedication.'
        },
        values: {
            title: 'Values',
            value1: 'Integrity in Action',
            value2: 'Cultural Respect',
            value3: 'Community First',
            value4: 'Sustainable Growth'
        },
        goals: {
            title: 'Goals',
            goal1: 'Expand Reach to 25 Districts',
            goal2: 'Empower 1M+ Youth',
            goal3: 'Preserve 50+ Heritage Sites',
            goal4: 'Global Partnerships'
        }
    };
    
    // About Background content
    const aboutBackgroundContent = {
        intro: {
            title: 'About LankaHope',
            description: 'LankaHope was established to strengthen the national health research system. Operating under the Ministry of Health, we serve as the apex body for coordinating, promoting, and conducting health research.'
        },
        vision: {
            title: 'Vision',
            description: 'To be the premier national organization, driving evidence-based healthcare policies and innovations for a healthier Sri Lanka.'
        },
        mission: {
            title: 'Mission',
            description: 'To promote, coordinate, and conduct high-quality research that addresses national priorities and contributes to improved outcomes for all Sri Lankans.'
        },
        values: {
            title: 'Core Values',
            value1: 'Excellence in Research',
            value2: 'Integrity & Ethics',
            value3: 'Collaboration & Partnership',
            value4: 'Innovation',
            value5: 'Transparency & Accountability'
        },
        mandate: {
            title: 'Mandate',
            description: 'To oversee and coordinate all activities in Sri Lanka, ensuring ethical standards, capacity building, and the translation of research into policy and practice.'
        },
        legacy: {
            title: 'A Legacy of Excellence',
            description: 'Since its inception, LankaHope has been at the forefront of advancing research in Sri Lanka.',
            stat1Value: '25+',
            stat1Label: 'Years of Service',
            stat2Value: '500+',
            stat2Label: 'Research Projects',
            stat3Value: '50+',
            stat3Label: 'Partner Institutions',
            stat4Value: '9',
            stat4Label: 'Provinces Covered'
        }
    };
    
    // About Administration content
    const aboutAdminContent = {
        intro: {
            title: 'Organizational Structure',
            description: 'LankaHope operates under a structured framework designed to ensure efficient coordination of activities across Sri Lanka.'
        },
        hierarchy: {
            directorGeneralName: 'Director General',
            directorGeneralDesc: 'Provides strategic leadership and oversees all operations.'
        },
        governance: {
            title: 'Governance',
            description: 'LankaHope is governed by a Board of Directors comprising distinguished professionals from the health sector, academia, and government.'
        }
    };
    
    // Contact page content
    const contactContent = {
        intro: {
            title: 'Contact Us',
            description: 'We\'d love to hear from you. Reach out to us for any inquiries.'
        },
        info: {
            address: 'No. 123, Norris Canal Road, Colombo 10, Sri Lanka',
            phone: '+94 11 269 3456',
            email: 'info@lankahope.lk',
            hours: 'Monday - Friday: 8:30 AM - 4:30 PM'
        }
    };
    
    // Seed all content
    const allContent = {
        'home': homeContent,
        'about-background': aboutBackgroundContent,
        'about-administration': aboutAdminContent,
        'contact': contactContent
    };
    
    for (const [pageId, sections] of Object.entries(allContent)) {
        console.log(`📄 Seeding ${pageId}...`);
        for (const [sectionId, fields] of Object.entries(sections)) {
            for (const [contentKey, content] of Object.entries(fields)) {
                await PageContent.findOneAndUpdate(
                    { pageId, sectionId, contentKey },
                    { 
                        pageId, 
                        sectionId, 
                        contentKey, 
                        content: String(content),
                        contentType: 'text'
                    },
                    { upsert: true, new: true }
                );
            }
        }
    }
    
    // Initialize site settings
    console.log('⚙️ Initializing site settings...');
    await SiteSettings.initializeDefaults();
    
    console.log('✅ Seeding complete!');
    process.exit(0);
};

seedContent().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
