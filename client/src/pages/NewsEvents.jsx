import React, { useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import axios from 'axios';
import { FaDownload } from 'react-icons/fa';

const EventCard = ({ event }) => {
    return (
        <div className="flex flex-col shadow-lg rounded-lg overflow-hidden bg-white">
            {/* Image Section */}
            <div className="h-64 bg-gray-200">
                {event.flyerImagePath ? (
                    <img
                        src={`http://localhost:5000${event.flyerImagePath}`}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-800">
                        No Image
                    </div>
                )}
            </div>

            {/* Details Section */}
            <div className="bg-unhro-dark-blue text-white p-4 flex-grow relative pb-12">
                <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                <p className="text-sm text-gray-300 font-light line-clamp-3 mb-2">{event.description}</p>
                <span className="text-xs text-gray-400 block mb-4">
                    {new Date(event.eventDate).toLocaleDateString()}
                </span>

                {/* Download Button */}
                <button className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition">
                    <FaDownload />
                </button>
            </div>
        </div>
    );
};

const NewsEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/events');
                setEvents(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching events:", error);
                setLoading(false);
                // Fallback
                setEvents([
                    { _id: 1, title: 'Annual Health Conference 2024', description: 'Join us for the biggest health research symposium.', eventDate: '2024-11-20', flyerImagePath: '' },
                    { _id: 2, title: 'Call for Abstracts', description: 'Submit your abstracts for the upcoming journal.', eventDate: '2024-10-15', flyerImagePath: '' },
                    { _id: 3, title: 'COVID-19 Research Update', description: 'Latest findings on post-pandemic recovery.', eventDate: '2024-09-01', flyerImagePath: '' },
                ]);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="bg-white min-h-screen pb-12">
            <PageTitle title="News & Events" />
            <div className="max-w-7xl mx-auto px-8 py-12">
                {loading ? (
                    <p className="text-center">Loading events...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsEvents;
