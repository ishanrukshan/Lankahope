import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PageTitle from '../components/PageTitle';
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Since we don't have a single event endpoint in previous list (just get all), 
                // we should double check if the backend supports GET by ID.
                // Assuming standard REST practices or finding it in the list.
                // Let's check route file... Ah, I didn't see a GET /:id in the route file earlier!
                // Wait, I saw router.put('/:id') and router.delete('/:id'). 
                // I MISSED router.get('/:id')? Let me re-read eventRoutes.js memory or check.
                // If it's missing, I'll need to add it. For now, I'll implement assuming I might need to add it.
                // Or I can fetch all and find one (inefficient but works if I can't edit backend easily).
                // Actually I CAN edit backend easily. I should add GET /:id to eventRoutes.js if missing.

                const { data } = await axios.get('/api/events');
                // Temporary workaround: Fetch all and find. 
                // Ideally should be axios.get(`/api/events/${id}`)

                const foundEvent = data.find(e => e._id === id);
                if (foundEvent) {
                    setEvent(foundEvent);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sl-maroon"></div>
        </div>
    );

    if (error || !event) return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
            <Link to="/news-events" className="text-sl-maroon hover:underline flex items-center gap-2">
                <FaArrowLeft /> Back to News & Events
            </Link>
        </div>
    );

    const isEvent = event.type === 'EVENT';
    const dateObj = new Date(event.eventDate);

    return (
        <div className="bg-white min-h-screen pb-12">
            <PageTitle title={event.type === 'NEWS' ? 'News Article' : 'Event Details'} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link to="/news-events" className="inline-flex items-center text-gray-500 hover:text-sl-maroon mb-6 transition-colors font-medium">
                    <FaArrowLeft className="mr-2" /> Back to List
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Hero Image */}
                    {event.flyerImagePath && (
                        <div className="w-full h-64 md:h-96 relative">
                            <img
                                src={event.flyerImagePath}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider text-white shadow-md ${isEvent ? 'bg-purple-600' : 'bg-blue-600'
                                    }`}>
                                    {isEvent ? 'Event' : 'News'}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="p-6 md:p-10">
                        {/* Header */}
                        <div className="mb-8 border-b border-gray-100 pb-8">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                                {event.title}
                            </h1>
                            <div className="flex items-center text-gray-500 font-medium">
                                <FaCalendarAlt className="mr-2 text-un-blue" />
                                {dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                            {/* Description (Intro) */}
                            {event.description && (
                                <p className="font-semibold text-gray-800 mb-6 text-xl">
                                    {event.description}
                                </p>
                            )}

                            {/* Main Content */}
                            {event.content ? (
                                <div
                                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed ql-editor"
                                    dangerouslySetInnerHTML={{ __html: event.content }}
                                />
                            ) : (
                                <p className="italic text-gray-400">No additional details provided.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
