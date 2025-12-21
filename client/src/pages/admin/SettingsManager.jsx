import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API from '../../config/api';
import {
    FaArrowLeft, FaSave, FaSpinner, FaCheck, FaTimes, FaCog,
    FaPhone, FaShare, FaQuoteRight, FaPalette, FaSearch, FaImage, FaUpload
} from 'react-icons/fa';

const SettingsManager = () => {
    const [settings, setSettings] = useState([]);
    const [editedSettings, setEditedSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeCategory, setActiveCategory] = useState('general');

    const token = localStorage.getItem('adminToken');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const categories = [
        { id: 'general', name: 'General', icon: <FaCog /> },
        { id: 'contact', name: 'Contact Info', icon: <FaPhone /> },
        { id: 'social', name: 'Social Media', icon: <FaShare /> },
        { id: 'footer', name: 'Footer', icon: <FaQuoteRight /> },
        { id: 'seo', name: 'SEO', icon: <FaSearch /> },
        { id: 'appearance', name: 'Appearance', icon: <FaPalette /> }
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(API.url('/api/settings/all'), config);
            setSettings(data);

            const edited = {};
            data.forEach(setting => {
                edited[setting.key] = setting.value;
            });
            setEditedSettings(edited);
        } catch (error) {
            console.error('Error fetching settings:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('userInfo');
                window.location.href = '/admin/login';
                return;
            }
            setMessage({ type: 'error', text: 'Failed to load settings. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key, value) => {
        setEditedSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await axios.put(API.url('/api/settings'), { settings: editedSettings }, config);
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
            fetchSettings(); // Refresh to get updated data
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin/login';
                return;
            }
            setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const initializeSettings = async () => {
        try {
            setLoading(true);
            await axios.post(API.url('/api/settings/initialize'), {}, config);
            setMessage({ type: 'success', text: 'Default settings initialized!' });
            fetchSettings();
        } catch (error) {
            console.error('Error initializing settings:', error);
            setMessage({ type: 'error', text: 'Failed to initialize settings.' });
            setLoading(false);
        }
    };

    const handleImageUpload = async (settingKey, file) => {
        if (!file) return;

        setUploadingImage(settingKey);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('name', `setting-${settingKey}-${Date.now()}`);
        formData.append('category', 'logo');
        formData.append('pageId', 'settings');
        formData.append('sectionId', settingKey);

        try {
            const { data } = await axios.post(API.url('/api/images'), formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            handleChange(settingKey, data.url);
            setMessage({ type: 'success', text: 'Image uploaded! Remember to save changes.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage({ type: 'error', text: 'Failed to upload image.' });
        } finally {
            setUploadingImage(null);
        }
    };

    const getCategorySettings = (categoryId) => {
        return settings.filter(s => s.category === categoryId);
    };

    const hasChanges = () => {
        return settings.some(s => editedSettings[s.key] !== s.value);
    };

    const renderInput = (setting) => {
        const value = editedSettings[setting.key] ?? setting.value ?? '';
        const isUploading = uploadingImage === setting.key;

        switch (setting.type) {
            case 'image':
                return (
                    <div className="space-y-3">
                        {value && (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                                <img
                                    src={API.imageUrl(value) || value}
                                    alt={setting.label}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sl-maroon to-sl-maroon/80 text-white rounded-lg cursor-pointer hover:from-sl-maroon/90 hover:to-sl-maroon/70 transition-all shadow-md">
                                {isUploading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                                <span className="text-sm font-medium">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(setting.key, e.target.files[0])}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sl-maroon/50 focus:border-sl-maroon transition-all text-sm"
                            placeholder="Or paste image URL..."
                        />
                    </div>
                );

            case 'color':
                return (
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={value || '#000000'}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                            className="w-14 h-12 rounded-lg border-2 border-gray-200 cursor-pointer shadow-sm"
                        />
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sl-maroon/50 focus:border-sl-maroon transition-all"
                            placeholder="#000000"
                        />
                    </div>
                );

            case 'boolean':
                return (
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value === true || value === 'true'}
                            onChange={(e) => handleChange(setting.key, e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-sl-maroon/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-sl-maroon"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">{value ? 'Enabled' : 'Disabled'}</span>
                    </label>
                );

            case 'email':
                return (
                    <input
                        type="email"
                        value={value}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sl-maroon/50 focus:border-sl-maroon transition-all"
                        placeholder="email@example.com"
                    />
                );

            case 'url':
                return (
                    <input
                        type="url"
                        value={value}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sl-maroon/50 focus:border-sl-maroon transition-all"
                        placeholder="https://..."
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sl-maroon/50 focus:border-sl-maroon transition-all"
                    />
                );

            default:
                // Use textarea for long text settings
                const isLongText = setting.key.toLowerCase().includes('text') ||
                    setting.key.toLowerCase().includes('description') ||
                    setting.key.toLowerCase().includes('keywords');

                if (isLongText) {
                    return (
                        <textarea
                            value={value}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sl-maroon/50 focus:border-sl-maroon transition-all resize-none"
                        />
                    );
                }

                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sl-maroon/50 focus:border-sl-maroon transition-all"
                    />
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-5xl text-sl-maroon mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/dashboard" className="p-2 text-gray-500 hover:text-sl-maroon hover:bg-gray-100 rounded-lg transition-all">
                            <FaArrowLeft className="text-xl" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
                            <p className="text-sm text-gray-500">Manage your website configuration</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {settings.length === 0 && (
                            <button
                                onClick={initializeSettings}
                                className="flex items-center gap-2 bg-gray-600 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-all font-medium shadow-md"
                            >
                                <FaCog />
                                <span>Initialize Defaults</span>
                            </button>
                        )}
                        {hasChanges() && (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 bg-gradient-to-r from-sl-maroon to-sl-maroon/80 text-white px-6 py-2.5 rounded-lg hover:from-sl-maroon/90 hover:to-sl-maroon/70 disabled:opacity-50 transition-all font-medium shadow-lg"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className="max-w-7xl mx-auto px-4 mt-4">
                    <div className={`p-4 rounded-xl flex items-center justify-between shadow-sm ${message.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        <div className="flex items-center gap-3">
                            {message.type === 'success' ? <FaCheck className="text-lg" /> : <FaTimes className="text-lg" />}
                            <span className="font-medium">{message.text}</span>
                        </div>
                        <button
                            onClick={() => setMessage({ type: '', text: '' })}
                            className="p-1 hover:bg-black/5 rounded-lg transition-all"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-6">
                {settings.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaCog className="text-4xl text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-3">No Settings Found</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Click "Initialize Defaults" to set up the default site settings and start customizing your website.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-12 gap-6">
                        {/* Category Sidebar */}
                        <div className="col-span-12 lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-24">
                                <h2 className="font-bold text-gray-700 mb-4 px-2">Categories</h2>
                                <div className="space-y-1">
                                    {categories.map(cat => {
                                        const count = getCategorySettings(cat.id).length;
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => setActiveCategory(cat.id)}
                                                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeCategory === cat.id
                                                        ? 'bg-gradient-to-r from-sl-maroon to-sl-maroon/80 text-white shadow-md'
                                                        : 'hover:bg-gray-50 text-gray-700'
                                                    }`}
                                            >
                                                <span className={`text-lg ${activeCategory === cat.id ? 'text-white' : 'text-gray-400'}`}>
                                                    {cat.icon}
                                                </span>
                                                <span className="font-medium flex-1">{cat.name}</span>
                                                {count > 0 && (
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${activeCategory === cat.id
                                                            ? 'bg-white/20 text-white'
                                                            : 'bg-gray-100 text-gray-500'
                                                        }`}>
                                                        {count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Settings Form */}
                        <div className="col-span-12 lg:col-span-9">
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                                    <h2 className="font-bold text-gray-800 text-lg">
                                        {categories.find(c => c.id === activeCategory)?.name} Settings
                                    </h2>
                                </div>
                                <div className="p-6">
                                    {getCategorySettings(activeCategory).length === 0 ? (
                                        <div className="text-center py-12">
                                            <FaImage className="text-4xl text-gray-200 mx-auto mb-3" />
                                            <p className="text-gray-400">No settings in this category.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {getCategorySettings(activeCategory).map(setting => (
                                                <div key={setting._id} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                        {setting.label}
                                                    </label>
                                                    {setting.description && (
                                                        <p className="text-xs text-gray-400 mb-3">{setting.description}</p>
                                                    )}
                                                    {renderInput(setting)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsManager;
