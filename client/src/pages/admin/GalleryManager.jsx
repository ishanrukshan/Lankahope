import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaSpinner, FaImages } from 'react-icons/fa';

const GalleryManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/gallery');
            setItems(data);
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to load gallery items' });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        if (image) formData.append('image', image);

        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('/api/gallery', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage({ type: 'success', text: 'Image added to gallery!' });
            setTitle('');
            setImage(null);
            setPreviewUrl(null);
            document.getElementById('galleryInput').value = "";
            fetchItems();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                window.location.href = '/admin/login';
                return;
            }
            setMessage({ type: 'error', text: 'Failed to upload image' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this image?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`/api/gallery/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ type: 'success', text: 'Image deleted' });
                fetchItems();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 401) {
                    window.location.href = '/admin/login';
                    return;
                }
                setMessage({ type: 'error', text: 'Failed to delete' });
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <FaImages className="text-pink-500" />
                        Gallery Manager
                    </h2>
                    <p className="text-gray-500 mt-1">Upload and manage photo gallery</p>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Upload Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Upload New Image</h3>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-1 w-full space-y-4">
                        <input
                            type="text"
                            placeholder="Image Title / Caption"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border p-3 rounded-lg"
                            required
                        />
                        <input
                            type="file"
                            id="galleryInput"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border p-2 rounded-lg"
                            required
                        />
                    </div>
                    {previewUrl && (
                        <div className="w-32 h-32 relative bg-gray-100 rounded-lg overflow-hidden border">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors disabled:opacity-50 h-12 mt-auto"
                    >
                        {submitting ? <FaSpinner className="animate-spin" /> : 'Upload'}
                    </button>
                </form>
            </div>

            {/* Grid */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Gallery Images ({items.length})</h3>
                {loading ? (
                    <div className="text-center py-10"><FaSpinner className="animate-spin text-3xl text-gray-400 mx-auto" /></div>
                ) : items.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No images in gallery yet.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {items.map(item => (
                            <div key={item._id} className="group relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 aspect-square">
                                <img src={item.imagePath} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                    <p className="text-white font-medium text-center mb-4 line-clamp-2">{item.title}</p>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                                    >
                                        <FaTrash />
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

export default GalleryManager;
