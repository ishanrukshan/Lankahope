import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../config/api';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import logo from '../assets/logo-blue.png';

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
        <footer className="bg-gray-900 text-white font-sans mt-auto border-t-4 border-un-blue">
            <div className="container mx-auto px-4 md:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Column 1: Brand & About */}
                    <div>
                        <div className="flex items-center mb-6">
                            <img src={logo} alt="UNHRO Logo" className="w-12 h-12 mr-4 bg-white rounded-full p-1" />
                            <h2 className="text-lg font-bold tracking-wide text-un-blue font-serif">United Nations Human Rights Organization</h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            UNHRO is dedicated to promoting human rights, cultural preservation, and community development to improve the lives of all citizens.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-un-blue transition-colors"><FaFacebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-un-blue transition-colors"><FaTwitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-un-blue transition-colors"><FaLinkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links & Announcements */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 border-b border-un-blue pb-2 inline-block text-white">Announcements</h3>
                        <ul className="space-y-4 text-sm text-gray-300">
                            {announcements.length > 0 ? (
                                announcements.map((item) => (
                                    <li key={item._id} className="hover:text-white transition-colors">
                                        <a href={item.link} target="_blank" rel="noreferrer" className="flex items-start">
                                            <span className="mr-2 text-un-blue">›</span>
                                            {item.text}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <a href="#" className="flex items-start hover:text-white">
                                        <span className="mr-2 text-un-blue">›</span>
                                        Annual Health Research Symposium 2025 - Colombo
                                    </a>
                                </li>
                            )}
                            <li>
                                <a href="#" className="flex items-start hover:text-white">
                                    <span className="mr-2 text-un-blue">›</span>
                                    Research Grant Applications - Batch 2025
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 border-b border-un-blue pb-2 inline-block text-white">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mr-3 mt-1 text-un-blue flex-shrink-0" />
                                <span>No. 30, BMICH, Bauddhaloka Mawatha.,<br />Colombo 7, Sri Lanka</span>
                            </li>
                            <li className="flex items-start">
                                <FaPhone className="mr-3 mt-1 text-un-blue flex-shrink-0" />
                                <div className="flex flex-col gap-1">
                                    <span>0777911177</span>
                                    <span>0718429670</span>
                                    <span>0711659166</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <FaEnvelope className="mr-3 mt-1 text-un-blue flex-shrink-0" />
                                <div className="flex flex-col gap-1">
                                    <span>UNHRO1010@gmail.com</span>
                                    <span>unitednationshumanrightso@gmail.com</span>
                                </div>
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
                <p>&copy; {new Date().getFullYear()} UNHRO. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
