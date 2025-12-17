import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaSave, FaEdit, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';

const ContentManager = () => {
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState(null);
    const [pageContent, setPageContent] = useState({});
    const [structure, setStructure] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editedContent, setEditedContent] = useState({});

    const token = localStorage.getItem('adminToken');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    // Page definitions
    const pageList = [
        { id: 'home', name: 'Home Page', icon: '🏠' },
        { id: 'about-background', name: 'About - Background', icon: '📋' },
        { id: 'about-administration', name: 'About - Administration', icon: '🏛️' },
        { id: 'about-research', name: 'About - Research', icon: '🔬' },
        { id: 'about-team', name: 'About - Our Team', icon: '👥' },
        { id: 'about-board', name: 'About - Board', icon: '📊' },
        { id: 'contact', name: 'Contact Page', icon: '📞' }
    ];

    useEffect(() => {
        fetchStructure();
    }, []);

    useEffect(() => {
        if (selectedPage) {
            fetchPageContent(selectedPage);
        }
    }, [selectedPage]);

    const fetchStructure = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/content/structure/all', config);
            setStructure(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching structure:', error);
            setLoading(false);
        }
    };

    const fetchPageContent = async (pageId) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:5000/api/content/${pageId}`);
            setPageContent(data);
            setEditedContent(JSON.parse(JSON.stringify(data))); // Deep copy
            setLoading(false);
        } catch (error) {
            console.error('Error fetching content:', error);
            setLoading(false);
        }
    };

    const handleContentChange = (sectionId, contentKey, value) => {
        setEditedContent(prev => ({
            ...prev,
            [sectionId]: {
                ...prev[sectionId],
                [contentKey]: value
            }
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await axios.put(
                `http://localhost:5000/api/content/${selectedPage}`,
                { sections: editedContent },
                config
            );
            setMessage({ type: 'success', text: 'Content saved successfully!' });
            setPageContent(editedContent);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Error saving content. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const hasChanges = () => {
        return JSON.stringify(pageContent) !== JSON.stringify(editedContent);
    };

    if (loading && !selectedPage) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-sl-maroon" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/admin/dashboard" className="text-gray-600 hover:text-sl-maroon">
                            <FaArrowLeft className="text-xl" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Content Manager</h1>
                    </div>
                    {selectedPage && (
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasChanges()}
                            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all ${
                                hasChanges() 
                                    ? 'bg-sl-maroon text-white hover:bg-sl-maroon/90' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                            <span>{saving ? 'Saving...' : hasChanges() ? 'Save Changes' : 'No Changes'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`max-w-7xl mx-auto px-4 mt-4`}>
                    <div className={`p-4 rounded-lg flex items-center space-x-2 ${
                        message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {message.type === 'success' ? <FaCheck /> : <FaTimes />}
                        <span>{message.text}</span>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar - Page List */}
                    <div className="col-span-3">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h2 className="font-bold text-gray-700 mb-4">Select Page</h2>
                            <div className="space-y-2">
                                {pageList.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => setSelectedPage(page.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center space-x-3 ${
                                            selectedPage === page.id
                                                ? 'bg-sl-maroon text-white'
                                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        <span className="text-xl">{page.icon}</span>
                                        <span className="font-medium">{page.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Editor */}
                    <div className="col-span-9">
                        {!selectedPage ? (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <div className="text-6xl mb-4">📝</div>
                                <h2 className="text-xl font-bold text-gray-700 mb-2">Select a Page to Edit</h2>
                                <p className="text-gray-500">Choose a page from the sidebar to start editing its content.</p>
                            </div>
                        ) : loading ? (
                            <div className="bg-white rounded-lg shadow-sm p-12 flex items-center justify-center">
                                <FaSpinner className="animate-spin text-4xl text-sl-maroon" />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Page Header */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {pageList.find(p => p.id === selectedPage)?.icon}{' '}
                                        {pageList.find(p => p.id === selectedPage)?.name}
                                    </h2>
                                    <p className="text-gray-500 mt-1">Edit the content sections below</p>
                                </div>

                                {/* Sections */}
                                {structure[selectedPage] && Object.entries(structure[selectedPage].sections).map(([sectionId, section]) => (
                                    <div key={sectionId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                        <div className="bg-gray-50 px-6 py-4 border-b">
                                            <h3 className="font-bold text-gray-700">{section.name}</h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {section.fields.map(field => (
                                                <div key={field} className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-600 capitalize">
                                                        {field.replace(/([A-Z])/g, ' $1').replace(/(\d+)/g, ' $1')}
                                                    </label>
                                                    {field.toLowerCase().includes('description') || 
                                                     field.toLowerCase().includes('message') ||
                                                     field.toLowerCase().includes('desc') ? (
                                                        <textarea
                                                            rows={4}
                                                            value={editedContent[sectionId]?.[field] || ''}
                                                            onChange={(e) => handleContentChange(sectionId, field, e.target.value)}
                                                            placeholder={`Enter ${field}...`}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon focus:border-transparent resize-none"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={editedContent[sectionId]?.[field] || ''}
                                                            onChange={(e) => handleContentChange(sectionId, field, e.target.value)}
                                                            placeholder={`Enter ${field}...`}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sl-maroon focus:border-transparent"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* No structure available */}
                                {!structure[selectedPage] && (
                                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                        <p className="text-gray-500">No editable sections defined for this page yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Save Bar */}
            {selectedPage && hasChanges() && (
                <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t shadow-lg p-4 z-50">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center space-x-2 text-amber-600">
                            <FaEdit />
                            <span className="font-medium">You have unsaved changes</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => {
                                    setEditedContent(JSON.parse(JSON.stringify(pageContent)));
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentManager;
