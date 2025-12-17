import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaSpinner, FaBullhorn, FaLink, FaExternalLinkAlt } from 'react-icons/fa';

const AnnouncementsManager = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        text: '',
        link: ''
    });

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const result = await axios.get('http://localhost:5000/api/announcements');
            setAnnouncements(result.data);
        } catch (error) {
            console.error('Error fetching announcements', error);
            setMessage({ type: 'error', text: 'Failed to load announcements' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await axios.delete(`http://localhost:5000/api/announcements/${id}`, config);
                setMessage({ type: 'success', text: 'Announcement deleted successfully' });
                fetchAnnouncements();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to delete' });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await axios.post('http://localhost:5000/api/announcements', formData, config);
            setMessage({ type: 'success', text: 'Announcement added successfully!' });
            setFormData({ text: '', link: '' });
            fetchAnnouncements();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to add announcement' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <FaBullhorn className="text-orange-500" />
                        Announcements
                    </h2>
                    <p className="text-gray-500 mt-1">Manage footer announcements and quick links</p>
                </div>
                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-medium">
                    {announcements.length} Links
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                    {message.text}
                </div>
            )}

            {/* Add Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <FaPlus className="text-green-500" />
                    Add New Announcement Link
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Text *</label>
                            <input
                                type="text"
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                placeholder="e.g. Annual Health Poll Reports"
                                required
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL Link *</label>
                            <input
                                type="url"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                placeholder="https://example.com/document.pdf"
                                required
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <FaPlus />
                                Add Announcement
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Announcements List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-6 text-gray-800">Current Announcements</h3>
                
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <FaSpinner className="animate-spin text-3xl text-gray-400" />
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <FaBullhorn className="text-5xl mx-auto mb-4 text-gray-300" />
                        <p>No announcements yet. Add your first one above!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {announcements.map((item, index) => (
                            <div 
                                key={item._id} 
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800 flex items-center gap-2">
                                            <FaLink className="text-orange-400 text-sm" />
                                            {item.text}
                                        </h4>
                                        <a 
                                            href={item.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            {item.link.length > 50 ? item.link.substring(0, 50) + '...' : item.link}
                                            <FaExternalLinkAlt className="text-xs" />
                                        </a>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-all flex items-center gap-2 opacity-0 group-hover:opacity-100"
                                >
                                    <FaTrash className="text-xs" />
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview Section */}
            {announcements.length > 0 && (
                <div className="bg-gray-800 p-6 rounded-xl">
                    <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                        <FaBullhorn className="text-orange-400" />
                        Footer Preview
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {announcements.map(item => (
                            <a
                                key={item._id}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-orange-400 text-sm transition-colors"
                            >
                                • {item.text}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementsManager;
