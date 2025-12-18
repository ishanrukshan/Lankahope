import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserPlus, FaTrash, FaSpinner, FaUsers, FaImage } from 'react-icons/fa';

const TeamManager = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        bio: '',
        order: 0,
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);



    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            setLoading(true);
            const result = await axios.get('/api/team');
            setTeam(result.data);
        } catch (error) {
            console.error('Error fetching team', error);
            setMessage({ type: 'error', text: 'Failed to load team members' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`/api/team/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ type: 'success', text: 'Member deleted successfully' });
                fetchTeam();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    window.location.href = '/admin/login';
                    return;
                }
                setMessage({ type: 'error', text: 'Failed to delete member' });
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
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
        data.append('name', formData.name);
        data.append('title', formData.title);
        data.append('bio', formData.bio);
        data.append('order', formData.order);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('/api/team', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage({ type: 'success', text: 'Team member added successfully!' });
            setFormData({ name: '', title: '', bio: '', order: 0, image: null });
            setPreviewUrl(null);
            document.getElementById('fileInput').value = "";
            fetchTeam();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                window.location.href = '/admin/login';
                return;
            }
            setMessage({ type: 'error', text: 'Failed to add member. Please try again.' });
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
                        <FaUsers className="text-blue-500" />
                        Team Members
                    </h2>
                    <p className="text-gray-500 mt-1">Add, edit, or remove team member profiles</p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
                    {team.length} Members
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
                    <FaUserPlus className="text-green-500" />
                    Add New Team Member
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter full name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter job title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input
                                type="number"
                                name="order"
                                placeholder="0"
                                value={formData.order}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    id="fileInput"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="w-full border border-gray-300 p-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {previewUrl && (
                                    <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Description</label>
                        <textarea
                            name="bio"
                            placeholder="Enter short biography or description"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full md:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-8 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <FaUserPlus />
                                Add Member
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Team List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-6 text-gray-800">Current Team Members</h3>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <FaSpinner className="animate-spin text-3xl text-gray-400" />
                    </div>
                ) : team.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <FaUsers className="text-5xl mx-auto mb-4 text-gray-300" />
                        <p>No team members yet. Add your first member above!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {team.sort((a, b) => a.order - b.order).map(member => (
                            <div key={member._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 overflow-hidden">
                                        {member.imagePath ? (
                                            <img
                                                src={member.imagePath}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                                                {member.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-800 truncate">{member.name}</h4>
                                        <p className="text-sm text-blue-600">{member.title}</p>
                                        <p className="text-xs text-gray-400 mt-1">Order: {member.order}</p>
                                    </div>
                                </div>
                                {member.bio && (
                                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{member.bio}</p>
                                )}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => handleDelete(member._id)}
                                        className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-all flex items-center gap-2"
                                    >
                                        <FaTrash className="text-xs" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamManager;
