import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../config/api';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Footer = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                // In production, un-comment this to fetch from API
                const { data } = await axios.get(API.url('/api/announcements'));
                setAnnouncements(data);
            } catch (error) {
                console.error("Failed to load announcements");
            }
        };
        fetchAnnouncements();
    }, []);

    return (
        <footer className="bg-gray-900 text-white font-sans mt-auto border-t-4 border-sl-gold">
            <div className="container mx-auto px-4 md:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Column 1: Brand & About */}
                    <div>
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 border border-sl-gold">
                                <span className="text-lg">🏛️</span>
                            </div>
                            <h2 className="text-xl font-bold tracking-wide text-sl-gold font-serif">LankaHope</h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            LankaHope is dedicated to promoting, directing, and coordinating health research to improve the lives of all citizens.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-sl-gold transition-colors"><FaFacebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-sl-gold transition-colors"><FaTwitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-sl-gold transition-colors"><FaLinkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links & Announcements */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 border-b border-sl-maroon pb-2 inline-block text-white">Announcements</h3>
                        <ul className="space-y-4 text-sm text-gray-300">
                            {announcements.length > 0 ? (
                                announcements.map((item) => (
                                    <li key={item._id} className="hover:text-white transition-colors">
                                        <a href={item.link} target="_blank" rel="noreferrer" className="flex items-start">
                                            <span className="mr-2 text-sl-gold">›</span>
                                            {item.text}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <a href="#" className="flex items-start hover:text-white">
                                        <span className="mr-2 text-sl-gold">›</span>
                                        Annual Health Research Symposium 2025 - Colombo
                                    </a>
                                </li>
                            )}
                            <li>
                                <a href="#" className="flex items-start hover:text-white">
                                    <span className="mr-2 text-sl-gold">›</span>
                                    Research Grant Applications - Batch 2025
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 border-b border-sl-maroon pb-2 inline-block text-white">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mr-3 mt-1 text-sl-gold" />
                                <span>No. 123, Norris Canal Road,<br />Colombo 10, Sri Lanka</span>
                            </li>
                            <li className="flex items-center">
                                <FaPhone className="mr-3 text-sl-gold" />
                                <span>+94 11 269 3456</span>
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="mr-3 text-sl-gold" />
                                <span>info@lankahope.lk</span>
                            </li>
                        </ul>
                        <div className="mt-6">
                            <input
                                type="email"
                                placeholder="Subscribe to Newsletter"
                                className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 w-full focus:outline-none focus:border-sl-gold"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-black py-4 border-t border-gray-800 text-center text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} LankaHope. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
