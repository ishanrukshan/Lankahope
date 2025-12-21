import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaCalendarAlt, FaBullhorn, FaEdit, FaImage, FaImages, FaCog, FaSignOutAlt, FaUserTie } from 'react-icons/fa';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        } else {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard Home', icon: <FaHome /> },
        { path: '/admin/dashboard/content', label: 'Page Content', icon: <FaEdit />, isNew: true },
        { path: '/admin/dashboard/images', label: 'Image Manager', icon: <FaImage />, isNew: true },
        { path: '/admin/dashboard/team', label: 'Manage Team', icon: <FaUsers /> },
        { path: '/admin/dashboard/events', label: 'News & Events', icon: <FaCalendarAlt /> },
        { path: '/admin/dashboard/announcements', label: 'Announcements', icon: <FaBullhorn /> },
        { path: '/admin/dashboard/board', label: 'Board Members', icon: <FaUserTie /> },
        { path: '/admin/dashboard/settings', label: 'Site Settings', icon: <FaCog />, isNew: true }
    ];

    const isActive = (path) => location.pathname === path;

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-gray-900 text-white flex-shrink-0 md:min-h-screen">
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-un-blue">🏛️ UNHRO</h2>
                    <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
                </div>
                <div className="p-4 border-b border-gray-700">
                    <p className="text-sm text-gray-300">Welcome,</p>
                    <p className="font-medium">{user.username}</p>
                </div>
                <nav className="mt-4">
                    <ul className="space-y-1 px-3">
                        {menuItems.map(item => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all ${isActive(item.path)
                                        ? 'bg-sl-maroon text-white'
                                        : 'text-gray-300 hover:bg-gray-800'
                                        }`}
                                >
                                    <span className={isActive(item.path) ? 'text-un-blue' : ''}>{item.icon}</span>
                                    <span>{item.label}</span>
                                    {item.isNew && (
                                        <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-un-blue text-gray-900 rounded font-bold">NEW</span>
                                    )}
                                </Link>
                            </li>
                        ))}
                        <li className="pt-4 mt-4 border-t border-gray-700">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 py-3 px-4 rounded-lg text-red-400 hover:bg-red-900/30 transition-all"
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto">
                {location.pathname === '/admin/dashboard' && (
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
                            <p className="text-gray-600">Welcome to the UNHRO Admin Panel. Manage your website content from here.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Link to="/admin/dashboard/content" className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-sl-maroon hover:shadow-md transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <FaEdit className="text-3xl text-sl-maroon" />
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">New</span>
                                </div>
                                <h3 className="font-bold text-gray-800 group-hover:text-sl-maroon">Page Content</h3>
                                <p className="text-sm text-gray-600 mt-2">Edit text content on any page of the website.</p>
                            </Link>

                            <Link to="/admin/dashboard/gallery" className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <FaImages className="text-3xl text-blue-500" />
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">New</span>
                                </div>
                                <h3 className="font-bold text-gray-800 group-hover:text-sl-maroon">Gallery</h3>
                                <p className="text-sm text-gray-600 mt-2">Manage image galleries for various sections.</p>
                            </Link>

                            <Link to="/admin/dashboard/images" className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-un-blue hover:shadow-md transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <FaImage className="text-3xl text-un-blue" />
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">New</span>
                                </div>
                                <h3 className="font-bold text-gray-800 group-hover:text-sl-maroon">Image Manager</h3>
                                <p className="text-sm text-gray-600 mt-2">Upload, replace, and delete images across the site.</p>
                            </Link>

                            <Link to="/admin/dashboard/team" className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all group">
                                <FaUsers className="text-3xl text-blue-500 mb-4" />
                                <h3 className="font-bold text-gray-800 group-hover:text-sl-maroon">Team Members</h3>
                                <p className="text-sm text-gray-600 mt-2">Add or remove staff photos and details.</p>
                            </Link>

                            <Link to="/admin/dashboard/events" className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-all group">
                                <FaCalendarAlt className="text-3xl text-purple-500 mb-4" />
                                <h3 className="font-bold text-gray-800 group-hover:text-sl-maroon">News & Events</h3>
                                <p className="text-sm text-gray-600 mt-2">Post upcoming events and news updates.</p>
                            </Link>

                            <Link to="/admin/dashboard/announcements" className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500 hover:shadow-md transition-all group">
                                <FaBullhorn className="text-3xl text-orange-500 mb-4" />
                                <h3 className="font-bold text-gray-800 group-hover:text-sl-maroon">Announcements</h3>
                                <p className="text-sm text-gray-600 mt-2">Update footer announcements and links.</p>
                            </Link>

                            <Link to="/admin/dashboard/board" className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-teal-500 hover:shadow-md transition-all group">
                                <FaUserTie className="text-3xl text-teal-500 mb-4" />
                                <h3 className="font-bold text-gray-800 group-hover:text-sl-maroon">Board Members</h3>
                                <p className="text-sm text-gray-600 mt-2">Manage board and committee members with photos.</p>
                            </Link>

                            <Link to="/admin/dashboard/settings" className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-gray-500 hover:shadow-md transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <FaCog className="text-3xl text-gray-500" />
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">New</span>
                                </div>
                                <h3 className="font-bold text-gray-800 group-hover:text-sl-maroon">Site Settings</h3>
                                <p className="text-sm text-gray-600 mt-2">Configure site name, contact info, and more.</p>
                            </Link>
                        </div>
                    </div>
                )}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;
