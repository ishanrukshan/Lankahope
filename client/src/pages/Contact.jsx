import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Submitting...');
        try {
            await axios.post('http://localhost:5000/api/contact', formData);
            setStatus('Message sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus('Failed to send message.');
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <PageTitle title="Contact Us" />

            <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col md:flex-row gap-12">

                {/* Left Column: Map & Address */}
                <div className="w-full md:w-1/2">
                    <h3 className="text-xl font-bold text-unhro-dark-blue mb-6">Our Location</h3>
                    {/* Google Map Placeholder */}
                    <div className="w-full h-80 bg-gray-200 rounded shadow mb-6 relative">
                        <iframe
                            title="map"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight="0"
                            marginWidth="0"
                            src="https://maps.google.com/maps?q=Entebbe%20Uganda&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            className="absolute inset-0"
                        ></iframe>
                    </div>

                    <div className="bg-gray-50 p-6 rounded relative border-l-4 border-unhro-dark-blue">
                        <h4 className="font-bold text-unhro-dark-blue mb-2">Uganda National Health Research Organisation</h4>
                        <p className="text-gray-700 mb-1">Plot 123, Airport Road</p>
                        <p className="text-gray-700 mb-1">P.O. Box 78, Entebbe - Uganda</p>
                        <p className="text-gray-700 mb-1">Tel: +256 123 456 789</p>
                        <p className="text-gray-700">Email: info@unhro.org.ug</p>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="w-full md:w-1/2 bg-[#E0F7FA] p-8 rounded shadow">
                    <h3 className="text-xl font-bold text-unhro-dark-blue mb-6">Send us a Message</h3>
                    {status && <p className="mb-4 text-center font-bold text-blue-800">{status}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-[#B2EBF2] border-0 p-3 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#B2EBF2] border-0 p-3 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full bg-[#B2EBF2] border-0 p-3 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                            <textarea
                                name="message"
                                rows="4"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full bg-[#B2EBF2] border-0 p-3 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            ></textarea>
                        </div>

                        <button type="submit" className="w-full bg-unhro-purple hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition shadow-lg mt-4">
                            SUBMIT
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Contact;
