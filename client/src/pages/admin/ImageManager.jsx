import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    FaArrowLeft, FaUpload, FaTrash, FaEdit, FaSpinner, FaCheck, FaTimes,
    FaImage, FaSearch, FaFilter, FaEye, FaDownload, FaExchangeAlt
} from 'react-icons/fa';

const ImageManager = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [filter, setFilter] = useState({ page: '', category: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // Upload form state
    const [uploadForm, setUploadForm] = useState({
        file: null,
        name: '',
        pageId: '',
        sectionId: '',
        altText: '',
        description: '',
        category: 'other'
    });



    const categories = ['hero', 'team', 'gallery', 'logo', 'background', 'content', 'other'];
    const pageOptions = [
        { id: 'home', name: 'Home Page' },
        { id: 'about-background', name: 'About - Background' },
        { id: 'about-administration', name: 'About - Administration' },
        { id: 'about-research', name: 'About - Research' },
        { id: 'about-team', name: 'About - Our Team' },
        { id: 'about-board', name: 'About - Board' },
        { id: 'contact', name: 'Contact' }
    ];

    const pageSections = {
        'home': [
            { id: 'hero', name: 'Hero Section' },
            { id: 'commitment', name: 'Commitment Section' },
            { id: 'chairman', name: "Chairman's Message" },
            { id: 'pillars', name: 'Pillars Section' },
            { id: 'vision', name: 'Vision Pillar' },
            { id: 'mission', name: 'Mission Pillar' },
            { id: 'values', name: 'Values Pillar' },
            { id: 'goals', name: 'Goals Pillar' }
        ],
        'about-background': [
            { id: 'intro', name: 'Introduction' },
            { id: 'vision', name: 'Vision' },
            { id: 'mission', name: 'Mission' },
            { id: 'values', name: 'Core Values' },
            { id: 'mandate', name: 'Mandate' },
            { id: 'legacy', name: 'Legacy' }
        ],
        'about-administration': [
            { id: 'intro', name: 'Introduction' },
            { id: 'hierarchy', name: 'Organizational Hierarchy' },
            { id: 'governance', name: 'Governance' }
        ],
        'about-research': [
            { id: 'intro', name: 'Introduction' },
            { id: 'collaboration', name: 'Collaboration' }
        ],
        'about-team': [
            { id: 'intro', name: 'Introduction' },
            { id: 'team', name: 'Team Members' },
            { id: 'join', name: 'Join Us' }
        ],
        'about-board': [
            { id: 'intro', name: 'Introduction' },
            { id: 'board', name: 'Board Members' }
        ],
        'contact': [
            { id: 'intro', name: 'Introduction' },
            { id: 'info', name: 'Contact Info' }
        ]
    };

    useEffect(() => {
        fetchImages();
    }, [filter]);

    const fetchImages = async () => {
        try {
            setLoading(true);
            let url = '/api/images';
            const params = new URLSearchParams();
            if (filter.page) params.append('pageId', filter.page);
            if (filter.category) params.append('category', filter.category);
            if (params.toString()) url += `?${params.toString()}`;

            const { data } = await axios.get(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            setImages(data);
        } catch (error) {
            console.error('Error fetching images:', error);
            if (error.response && error.response.status === 401) {
                // Token invalid or expired
                localStorage.removeItem('adminToken');
                localStorage.removeItem('userInfo');
                window.location.href = '/admin/login';
                return;
            }
            setMessage({ type: 'error', text: 'Failed to load images' });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadForm(prev => ({
                ...prev,
                file,
                name: prev.name || file.name.split('.')[0]
            }));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadForm.file) {
            setMessage({ type: 'error', text: 'Please select a file to upload' });
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', uploadForm.file);
            formData.append('name', uploadForm.name);
            formData.append('pageId', uploadForm.pageId);
            formData.append('sectionId', uploadForm.sectionId);
            formData.append('altText', uploadForm.altText);
            formData.append('description', uploadForm.description);
            formData.append('category', uploadForm.category);

            await axios.post('/api/images', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage({ type: 'success', text: 'Image uploaded successfully!' });
            setShowUploadModal(false);
            resetUploadForm();
            fetchImages();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload image' });
        } finally {
            setUploading(false);
        }
    };

    const handleReplace = async (e) => {
        e.preventDefault();
        if (!uploadForm.file || !selectedImage) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', uploadForm.file);
            if (uploadForm.altText) formData.append('altText', uploadForm.altText);
            if (uploadForm.description) formData.append('description', uploadForm.description);

            await axios.put(`/api/images/${selectedImage._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage({ type: 'success', text: 'Image replaced successfully!' });
            setShowEditModal(false);
            resetUploadForm();
            fetchImages();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to replace image' });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            await axios.delete(`/api/images/${imageId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            setMessage({ type: 'success', text: 'Image deleted successfully!' });
            fetchImages();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete image' });
        }
    };

    const resetUploadForm = () => {
        setUploadForm({
            file: null,
            name: '',
            pageId: '',
            sectionId: '',
            altText: '',
            description: '',
            category: 'other'
        });
    };

    const filteredImages = images.filter(img =>
        img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.originalName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/admin/dashboard" className="text-gray-600 hover:text-sl-maroon">
                            <FaArrowLeft className="text-xl" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Image Manager</h1>
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center space-x-2 bg-sl-maroon text-white px-6 py-2 rounded-lg hover:bg-sl-maroon/90"
                    >
                        <FaUpload />
                        <span>Upload Image</span>
                    </button>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className="max-w-7xl mx-auto px-4 mt-4">
                    <div className={`p-4 rounded-lg flex items-center justify-between ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        <div className="flex items-center space-x-2">
                            {message.type === 'success' ? <FaCheck /> : <FaTimes />}
                            <span>{message.text}</span>
                        </div>
                        <button onClick={() => setMessage({ type: '', text: '' })}>
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search images..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon focus:border-transparent"
                                />
                            </div>
                        </div>
                        <select
                            value={filter.page}
                            onChange={(e) => setFilter(prev => ({ ...prev, page: e.target.value }))}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon"
                        >
                            <option value="">All Pages</option>
                            {pageOptions.map(page => (
                                <option key={page.id} value={page.id}>{page.name}</option>
                            ))}
                        </select>
                        <select
                            value={filter.category}
                            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="capitalize">{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Image Display */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <FaSpinner className="animate-spin text-4xl text-sl-maroon" />
                    </div>
                ) : filter.page && pageSections[filter.page] ? (
                    /* Section-based view when page is selected */
                    <div className="space-y-6">
                        {pageSections[filter.page].map(section => {
                            const sectionImages = filteredImages.filter(img => img.sectionId === section.id);
                            return (
                                <div key={section.id} className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-800">{section.name}</h3>
                                        <button
                                            onClick={() => {
                                                setUploadForm(prev => ({ ...prev, pageId: filter.page, sectionId: section.id }));
                                                setShowUploadModal(true);
                                            }}
                                            className="text-sm flex items-center space-x-1 text-sl-maroon hover:text-sl-maroon/80"
                                        >
                                            <FaUpload className="text-xs" />
                                            <span>Upload to Section</span>
                                        </button>
                                    </div>
                                    {sectionImages.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {sectionImages.map(image => (
                                                <div key={image._id} className="bg-gray-50 rounded-lg overflow-hidden group">
                                                    <div className="relative aspect-square bg-gray-100">
                                                        <img
                                                            src={image.url}
                                                            alt={image.altText || image.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af">No Image</text></svg>';
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                                            <button
                                                                onClick={() => { setSelectedImage(image); setShowPreviewModal(true); }}
                                                                className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                                                                title="Preview"
                                                            >
                                                                <FaEye />
                                                            </button>
                                                            <button
                                                                onClick={() => { setSelectedImage(image); setShowEditModal(true); }}
                                                                className="p-2 bg-white rounded-full text-blue-600 hover:bg-gray-100"
                                                                title="Replace"
                                                            >
                                                                <FaExchangeAlt />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(image._id)}
                                                                className="p-2 bg-white rounded-full text-red-600 hover:bg-gray-100"
                                                                title="Delete"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="p-2">
                                                        <p className="font-medium text-gray-800 truncate text-xs">{image.name}</p>
                                                        <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                                            <FaImage className="text-3xl text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-400 text-sm">No images for this section</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : filteredImages.length === 0 ? (
                    /* Empty state */
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-700 mb-2">No Images Found</h2>
                        <p className="text-gray-500">Select a page to see images organized by sections, or upload your first image.</p>
                    </div>
                ) : (
                    /* Grid view when no page selected */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredImages.map(image => (
                            <div key={image._id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                                <div className="relative aspect-square bg-gray-100">
                                    <img
                                        src={image.url}
                                        alt={image.altText || image.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af">No Image</text></svg>';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                        <button
                                            onClick={() => { setSelectedImage(image); setShowPreviewModal(true); }}
                                            className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                                            title="Preview"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedImage(image); setShowEditModal(true); }}
                                            className="p-2 bg-white rounded-full text-blue-600 hover:bg-gray-100"
                                            title="Replace"
                                        >
                                            <FaExchangeAlt />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(image._id)}
                                            className="p-2 bg-white rounded-full text-red-600 hover:bg-gray-100"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="font-medium text-gray-800 truncate text-sm">{image.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                                    {image.category && (
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-un-blue/20 text-sl-maroon text-xs rounded-full capitalize">
                                            {image.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Upload Image</h2>
                                <button onClick={() => { setShowUploadModal(false); resetUploadForm(); }} className="text-gray-500 hover:text-gray-700">
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>
                            <form onSubmit={handleUpload} className="space-y-4">
                                {/* File Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image File *</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-sl-maroon transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="imageUpload"
                                        />
                                        <label htmlFor="imageUpload" className="cursor-pointer">
                                            {uploadForm.file ? (
                                                <div>
                                                    <FaCheck className="text-3xl text-green-500 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-600">{uploadForm.file.name}</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-600">Click to select image</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Name *</label>
                                    <input
                                        type="text"
                                        value={uploadForm.name}
                                        onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon"
                                        required
                                    />
                                </div>

                                {/* Page */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Page</label>
                                    <select
                                        value={uploadForm.pageId}
                                        onChange={(e) => setUploadForm(prev => ({ ...prev, pageId: e.target.value, sectionId: '' }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon"
                                        required
                                    >
                                        <option value="">Select Page</option>
                                        {pageOptions.map(page => (
                                            <option key={page.id} value={page.id}>{page.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Section */}
                                {uploadForm.pageId && pageSections[uploadForm.pageId] && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
                                        <select
                                            value={uploadForm.sectionId}
                                            onChange={(e) => setUploadForm(prev => ({ ...prev, sectionId: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon"
                                            required
                                        >
                                            <option value="">Select Section</option>
                                            {pageSections[uploadForm.pageId].map(section => (
                                                <option key={section.id} value={section.id}>{section.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={uploadForm.category}
                                        onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat} className="capitalize">{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Alt Text */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                                    <input
                                        type="text"
                                        value={uploadForm.altText}
                                        onChange={(e) => setUploadForm(prev => ({ ...prev, altText: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon"
                                        placeholder="Describe the image..."
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={uploading || !uploadForm.file}
                                    className="w-full bg-sl-maroon text-white py-3 rounded-lg hover:bg-sl-maroon/90 disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {uploading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit/Replace Modal */}
            {showEditModal && selectedImage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Replace Image</h2>
                                <button onClick={() => { setShowEditModal(false); resetUploadForm(); }} className="text-gray-500 hover:text-gray-700">
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">Current: <strong>{selectedImage.name}</strong></p>
                            </div>
                            <form onSubmit={handleReplace} className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-sl-maroon transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="imageReplace"
                                    />
                                    <label htmlFor="imageReplace" className="cursor-pointer">
                                        {uploadForm.file ? (
                                            <div>
                                                <FaCheck className="text-3xl text-green-500 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">{uploadForm.file.name}</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <FaExchangeAlt className="text-3xl text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">Select new image</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={uploading || !uploadForm.file}
                                    className="w-full bg-sl-maroon text-white py-3 rounded-lg hover:bg-sl-maroon/90 disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {uploading ? <FaSpinner className="animate-spin" /> : <FaExchangeAlt />}
                                    <span>{uploading ? 'Replacing...' : 'Replace Image'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreviewModal && selectedImage && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setShowPreviewModal(false)}>
                    <div className="max-w-4xl w-full">
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.altText || selectedImage.name}
                            className="max-h-[80vh] mx-auto object-contain"
                        />
                        <div className="text-center mt-4">
                            <p className="text-white font-medium">{selectedImage.name}</p>
                            <p className="text-gray-400 text-sm">{selectedImage.originalName}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageManager;
