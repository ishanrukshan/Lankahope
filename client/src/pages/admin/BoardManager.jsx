import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserTie, FaTrash, FaSpinner, FaEdit, FaImage } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || '';

const BoardManager = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        organization: '',
        order: 0,
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/board`);
            setMembers(data);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load board members' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this board member?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API_URL}/api/board/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMembers(members.filter(m => m._id !== id));
            setMessage({ type: 'success', text: 'Board member deleted successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete board member' });
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (member) => {
        setEditingId(member._id);
        setFormData({
            name: member.name,
            role: member.role,
            organization: member.organization || '',
            order: member.order || 0,
        });
        setPreview(member.imagePath ? `${API_URL}${member.imagePath}` : '');
        setFile(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', role: '', organization: '', order: 0 });
        setPreview('');
        setFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.role) {
            setMessage({ type: 'error', text: 'Name and Role are required' });
            return;
        }

        setSaving(true);
        const token = localStorage.getItem('adminToken');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('role', formData.role);
        data.append('organization', formData.organization);
        data.append('order', formData.order);
        if (file) {
            data.append('image', file);
        }

        try {
            if (editingId) {
                // Update existing member
                const { data: updatedMember } = await axios.put(
                    `${API_URL}/api/board/${editingId}`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                setMembers(members.map(m => m._id === editingId ? updatedMember : m));
                setMessage({ type: 'success', text: 'Board member updated successfully' });
            } else {
                // Create new member
                const { data: newMember } = await axios.post(
                    `${API_URL}/api/board`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                setMembers([...members, newMember]);
                setMessage({ type: 'success', text: 'Board member added successfully' });
            }

            // Reset form
            setFormData({ name: '', role: '', organization: '', order: 0 });
            setFile(null);
            setPreview('');
            setEditingId(null);
        } catch (error) {
            setMessage({ type: 'error', text: editingId ? 'Failed to update board member' : 'Failed to add board member' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <FaUserTie className="text-sl-maroon" />
                    Board Members Manager
                </h2>
                <p className="text-gray-600 mt-1">Add, edit, or remove board and committee members</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Add/Edit Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    {editingId ? 'Edit Board Member' : 'Add New Board Member'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon focus:border-transparent"
                                placeholder="Enter name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon focus:border-transparent"
                                placeholder="e.g., Board Chairman"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                            <input
                                type="text"
                                name="organization"
                                value={formData.organization}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon focus:border-transparent"
                                placeholder="e.g., Ministry of Health"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon focus:border-transparent"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                                <FaImage className="text-gray-600" />
                                <span className="text-sm text-gray-700">Choose Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            {preview && (
                                <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-full border-2 border-un-blue" />
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-sl-maroon text-white rounded-lg hover:bg-sl-maroon/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving && <FaSpinner className="animate-spin" />}
                            {editingId ? 'Update Member' : 'Add Member'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Members List */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Current Board Members</h3>

                {loading ? (
                    <div className="text-center py-8">
                        <FaSpinner className="animate-spin text-3xl text-sl-maroon mx-auto" />
                        <p className="mt-2 text-gray-600">Loading...</p>
                    </div>
                ) : members.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No board members added yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {members.map((member) => (
                            <div key={member._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    {member.imagePath ? (
                                        <img
                                            src={`${API_URL}${member.imagePath}`}
                                            alt={member.name}
                                            className="w-16 h-16 object-cover rounded-full border-2 border-un-blue/30"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sl-maroon to-sl-maroon/80 flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-xl font-serif">{member.name.charAt(0)}</span>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-800 truncate">{member.name}</h4>
                                        <p className="text-sm text-un-blue">{member.role}</p>
                                        {member.organization && (
                                            <p className="text-xs text-gray-500 truncate">{member.organization}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">Order: {member.order}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member._id)}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                    >
                                        <FaTrash /> Delete
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

export default BoardManager;
