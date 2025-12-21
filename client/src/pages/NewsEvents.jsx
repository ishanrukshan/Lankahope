import React, { useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaNewspaper, FaArrowRight } from 'react-icons/fa';

const EventCard = ({ event }) => {
    const isEvent = event.type === 'EVENT';

    // Format date nicely
    const dateObj = new Date(event.eventDate);
    const dateStr = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const dayNumeric = dateObj.toLocaleDateString('en-US', { day: '2-digit' });

    // Handle image path correctly
    const imageSrc = event.flyerImagePath
        ? (event.flyerImagePath.startsWith('http') ? event.flyerImagePath : event.flyerImagePath)
        : null;

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden bg-gray-100">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${isEvent ? 'from-purple-500 to-indigo-600' : 'from-blue-500 to-cyan-600'} flex items-center justify-center`}>
                        {isEvent ? <FaCalendarAlt className="text-white text-4xl opacity-50" /> : <FaNewspaper className="text-white text-4xl opacity-50" />}
                    </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm ${isEvent ? 'bg-purple-600' : 'bg-blue-600'
                        }`}>
                        {isEvent ? 'Event' : 'News'}
                    </span>
                </div>

                {/* Date Overlay (Mobile/Small) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:hidden">
                    <p className="text-white font-medium">{dateStr}</p>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex gap-4 mb-3">
                    {/* Date Box (Desktop) */}
                    <div className="hidden md:flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2 min-w-[60px] h-[60px] border border-gray-200">
                        <span className="text-sm font-bold text-gray-500 uppercase">{monthShort}</span>
                        <span className="text-2xl font-bold text-gray-800 leading-none">{dayNumeric}</span>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">
                            {event.title}
                        </h3>
                    </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {event.description}
                </p>

                <div className="border-t border-gray-100 pt-4 mt-auto">
                    {/* Fallback data ids are numbers, Mongo IDs are strings */}
                    {typeof event._id === 'string' ? (
                        <Link to={`/news-events/${event._id}`} className="text-sm font-bold flex items-center gap-2 transition-colors duration-200 group-hover:gap-3"
                            style={{ color: isEvent ? '#9333ea' : '#2563eb' }}>
                            Read More <FaArrowRight className="text-xs" />
                        </Link>
                    ) : (
                        <span className="text-sm font-bold flex items-center gap-2 cursor-not-allowed opacity-50"
                            style={{ color: isEvent ? '#9333ea' : '#2563eb' }}>
                            Read More <FaArrowRight className="text-xs" />
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const NewsEvents = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, NEWS, EVENT

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Use relative path for proxy
                const { data } = await axios.get('/api/events');
                // Backend might send string dates, ensuring sorting works
                const sortedData = data.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
                setEvents(sortedData);
                setFilteredEvents(sortedData);
            } catch (error) {
                console.error("Error fetching events:", error);
                // Fallback data for demo handling if API fails (e.g. during dev/network issues)
                const fallbackData = [
                    { _id: 1, title: 'Annual Health Symposium 2025', description: 'Join us for a groundbreaking discussion on the future of public health in Sri Lanka.', eventDate: '2025-11-20', type: 'EVENT' },
                    { _id: 2, title: 'UNHRO Launches New Initiative', description: 'We are proud to announce our new community outreach program targeting rural areas.', eventDate: '2025-10-15', type: 'NEWS' },
                    { _id: 3, title: 'Medical Research Abstract Call', description: 'Submit your research abstracts for the upcoming international journal publication.', eventDate: '2025-09-01', type: 'NEWS' },
                ];
                setEvents(fallbackData);
                setFilteredEvents(fallbackData);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        if (filter === 'ALL') {
            setFilteredEvents(events);
        } else {
            setFilteredEvents(events.filter(e => e.type === filter));
        }
    }, [filter, events]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <PageTitle title="News & Events" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filter Controls */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                        <button
                            onClick={() => setFilter('ALL')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'ALL' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            All Posts
                        </button>
                        <button
                            onClick={() => setFilter('NEWS')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'NEWS' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                        >
                            News
                        </button>
                        <button
                            onClick={() => setFilter('EVENT')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'EVENT' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                                }`}
                        >
                            Events
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100 p-4">
                                <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                                <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                            <FaNewspaper className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700">No posts found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your category filter</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsEvents;
