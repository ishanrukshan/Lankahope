import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { FaPlus, FaTrash, FaSpinner, FaCalendarAlt, FaNewspaper, FaImage } from 'react-icons/fa';

const EventsManager = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        eventDate: '',
        type: 'NEWS',
        flyerImage: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);



    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const result = await axios.get('/api/events');
            setEvents(result.data);
        } catch (error) {
            console.error('Error fetching events', error);
            setMessage({ type: 'error', text: 'Failed to load events' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`/api/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ type: 'success', text: 'Item deleted successfully' });
                fetchEvents();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    window.location.href = '/admin/login';
                    return;
                }
                setMessage({ type: 'error', text: 'Failed to delete' });
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, flyerImage: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('content', formData.content);
        data.append('eventDate', formData.eventDate);
        data.append('type', formData.type);
        if (formData.flyerImage) {
            data.append('flyerImage', formData.flyerImage);
        }

        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('/api/events', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage({ type: 'success', text: 'Item created successfully!' });
            setFormData({ title: '', description: '', content: '', eventDate: '', type: 'NEWS', flyerImage: null });
            setPreviewUrl(null);
            document.getElementById('fileInput').value = "";
            fetchEvents();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                window.location.href = '/admin/login';
                return;
            }
            setMessage({ type: 'error', text: 'Failed to create. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const newsCount = events.filter(e => e.type === 'NEWS').length;
    const eventCount = events.filter(e => e.type === 'EVENT').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <FaCalendarAlt className="text-purple-500" />
                        News & Events
                    </h2>
                    <p className="text-gray-500 mt-1">Manage news articles and upcoming events</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                        <FaNewspaper />
                        {newsCount} News
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                        <FaCalendarAlt />
                        {eventCount} Events
                    </div>
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
                    Add New Item
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title / Headline *</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            >
                                <option value="NEWS">📰 News</option>
                                <option value="EVENT">📅 Event</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                            <input
                                type="date"
                                name="eventDate"
                                required
                                value={formData.eventDate}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Flyer / Image</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    id="fileInput"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="w-full border border-gray-300 p-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                />
                                {previewUrl && (
                                    <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded object-cover border-2 border-gray-200" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description / Summary</label>
                        <textarea
                            name="description"
                            placeholder="Enter description or summary"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Content / Article</label>
                        <div className="bg-white rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={(value) => setFormData({ ...formData, content: value })}
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link', 'blockquote'],
                                        ['clean']
                                    ]
                                }}
                                className="h-64 mb-12" // mb-12 needed because Quill toolbar takes space
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <FaPlus />
                                Create Item
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Events List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-6 text-gray-800">Current Items</h3>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <FaSpinner className="animate-spin text-3xl text-gray-400" />
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <FaCalendarAlt className="text-5xl mx-auto mb-4 text-gray-300" />
                        <p>No news or events yet. Add your first item above!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left p-4 font-medium text-gray-600">Image</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Date</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Type</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Title</th>
                                    <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)).map(event => (
                                    <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            {event.flyerImagePath ? (
                                                <img
                                                    src={event.flyerImagePath}
                                                    alt="flyer"
                                                    className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <FaImage className="text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {new Date(event.eventDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${event.type === 'EVENT'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {event.type === 'EVENT' ? '📅 Event' : '📰 News'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium text-gray-800">{event.title}</span>
                                            {event.description && (
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{event.description}</p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleDelete(event._id)}
                                                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-all flex items-center gap-2"
                                            >
                                                <FaTrash className="text-xs" />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsManager;
