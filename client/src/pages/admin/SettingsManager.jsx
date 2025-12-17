import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaSave, FaSpinner, FaCheck, FaTimes, FaCog, FaPhone, FaShare, FaFootballBall, FaPalette } from 'react-icons/fa';

const SettingsManager = () => {
    const [settings, setSettings] = useState([]);
    const [editedSettings, setEditedSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
        { id: 'footer', name: 'Footer', icon: <FaFootballBall /> },
        { id: 'appearance', name: 'Appearance', icon: <FaPalette /> }
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:5000/api/settings/all', config);
            setSettings(data);
            
            // Create edited settings object
            const edited = {};
            data.forEach(setting => {
                edited[setting.key] = setting.value;
            });
            setEditedSettings(edited);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessage({ type: 'error', text: 'Failed to load settings' });
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
            await axios.put('http://localhost:5000/api/settings', { settings: editedSettings }, config);
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    const initializeSettings = async () => {
        try {
            setLoading(true);
            await axios.post('http://localhost:5000/api/settings/initialize', {}, config);
            setMessage({ type: 'success', text: 'Settings initialized!' });
            fetchSettings();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to initialize settings' });
            setLoading(false);
        }
    };

    const getCategorySettings = (categoryId) => {
        return settings.filter(s => s.category === categoryId);
    };

    const hasChanges = () => {
        return settings.some(s => editedSettings[s.key] !== s.value);
    };

    const renderInput = (setting) => {
        const value = editedSettings[setting.key] ?? setting.value;

        switch (setting.type) {
            case 'color':
                return (
                    <div className="flex items-center space-x-3">
                        <input
                            type="color"
                            value={value || '#000000'}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => handleChange(setting.key, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon"
                            placeholder="#000000"
                        />
                    </div>
                );
            case 'boolean':
                return (
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value === true || value === 'true'}
                            onChange={(e) => handleChange(setting.key, e.target.checked)}
                            className="w-5 h-5 text-sl-maroon border-gray-300 rounded focus:ring-sl-maroon"
                        />
                        <span className="text-gray-700">Enabled</span>
                    </label>
                );
            case 'email':
                return (
                    <input
                        type="email"
                        value={value || ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon"
                        placeholder="email@example.com"
                    />
                );
            case 'url':
                return (
                    <input
                        type="url"
                        value={value || ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon"
                        placeholder="https://"
                    />
                );
            case 'number':
                return (
                    <input
                        type="number"
                        value={value || ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon"
                    />
                );
            default:
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon"
                    />
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-sl-maroon" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/admin/dashboard" className="text-gray-600 hover:text-sl-maroon">
                            <FaArrowLeft className="text-xl" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        {settings.length === 0 && (
                            <button
                                onClick={initializeSettings}
                                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                            >
                                <FaCog />
                                <span>Initialize Defaults</span>
                            </button>
                        )}
                        {hasChanges() && (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center space-x-2 bg-sl-maroon text-white px-6 py-2 rounded-lg hover:bg-sl-maroon/90 disabled:opacity-50"
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
                    <div className={`p-4 rounded-lg flex items-center justify-between ${
                        message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
                {settings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <FaCog className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-700 mb-2">No Settings Found</h2>
                        <p className="text-gray-500 mb-6">Click "Initialize Defaults" to set up default site settings.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-12 gap-6">
                        {/* Category Sidebar */}
                        <div className="col-span-3">
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h2 className="font-bold text-gray-700 mb-4">Categories</h2>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center space-x-3 ${
                                                activeCategory === cat.id
                                                    ? 'bg-sl-maroon text-white'
                                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            <span>{cat.icon}</span>
                                            <span className="font-medium">{cat.name}</span>
                                            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                                                activeCategory === cat.id ? 'bg-white/20' : 'bg-gray-200'
                                            }`}>
                                                {getCategorySettings(cat.id).length}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Settings Form */}
                        <div className="col-span-9">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b">
                                    <h2 className="font-bold text-gray-800">
                                        {categories.find(c => c.id === activeCategory)?.name} Settings
                                    </h2>
                                </div>
                                <div className="p-6 space-y-6">
                                    {getCategorySettings(activeCategory).length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No settings in this category.</p>
                                    ) : (
                                        getCategorySettings(activeCategory).map(setting => (
                                            <div key={setting._id} className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    {setting.label}
                                                </label>
                                                {setting.description && (
                                                    <p className="text-xs text-gray-500">{setting.description}</p>
                                                )}
                                                {renderInput(setting)}
                                            </div>
                                        ))
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
