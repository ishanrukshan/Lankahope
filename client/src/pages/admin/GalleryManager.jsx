import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaSpinner, FaImages, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';

const GalleryManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

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
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImages(files);
            setPreviewUrls(files.map(file => URL.createObjectURL(file)));
        }
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previewUrls.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviewUrls(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) {
            setMessage({ type: 'error', text: 'Please select at least one image' });
            return;
        }

        setSubmitting(true);

        const formData = new FormData();
        images.forEach(img => formData.append('images', img));

        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.post('/api/gallery/bulk', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage({ type: 'success', text: `${data.count} images uploaded successfully!` });
            setImages([]);
            setPreviewUrls([]);
            document.getElementById('galleryInput').value = "";
            fetchItems();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                window.location.href = '/admin/login';
                return;
            }
            setMessage({ type: 'error', text: 'Failed to upload images' });
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
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FaCloudUploadAlt className="text-pink-500" />
                    Upload Images
                    <span className="text-sm font-normal text-gray-500">(Select multiple)</span>
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Drop Zone */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-pink-400 transition-colors cursor-pointer bg-gray-50">
                        <input
                            type="file"
                            id="galleryInput"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label htmlFor="galleryInput" className="cursor-pointer block">
                            <FaCloudUploadAlt className="text-5xl text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">Click to select images</p>
                            <p className="text-gray-400 text-sm mt-1">or drag and drop (up to 20 images)</p>
                        </label>
                    </div>

                    {/* Preview Grid */}
                    {previewUrls.length > 0 && (
                        <div className="space-y-3">
                            <p className="font-medium text-gray-700">
                                {images.length} image{images.length > 1 ? 's' : ''} selected
                            </p>
                            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <FaTimes size={10} />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate">
                                            {images[index]?.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting || images.length === 0}
                        className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Uploading {images.length} image{images.length > 1 ? 's' : ''}...
                            </>
                        ) : (
                            <>
                                <FaPlus />
                                Upload {images.length > 0 ? `${images.length} Image${images.length > 1 ? 's' : ''}` : 'Images'}
                            </>
                        )}
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
