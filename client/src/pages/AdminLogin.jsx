import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/api/admin/login', { username, password });

            // Save token and user info
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('adminToken', data.token);

            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-unhro-dark-blue mb-6">Admin Login</h2>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-unhro-purple"
                            placeholder="Enter username"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-unhro-purple"
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-unhro-dark-blue text-white font-bold py-3 rounded hover:bg-blue-900 transition"
                    >
                        LOGIN
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
