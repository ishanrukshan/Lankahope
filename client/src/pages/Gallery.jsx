import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageTitle from '../components/PageTitle';
import { FaImages, FaSearchPlus } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || '';

const Gallery = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const { data } = await axios.get('/api/gallery');
                // Ensure data is an array (handle bulk upload response format)
                if (Array.isArray(data)) {
                    setItems(data);
                } else if (data && Array.isArray(data.items)) {
                    setItems(data.items);
                } else {
                    setItems([]);
                }
            } catch (error) {
                console.error("Error fetching gallery:", error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const openLightbox = (item) => {
        setSelectedImage(item);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <PageTitle title="Gallery" subtitle="Moments from our journey" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sl-maroon"></div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <FaImages className="text-5xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No images in gallery yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div
                                key={item._id}
                                className="group relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 aspect-square"
                                onClick={() => openLightbox(item)}
                            >
                                <img
                                    src={item.imagePath?.startsWith('http') ? item.imagePath : `${API_URL}${item.imagePath}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <FaSearchPlus className="text-white text-3xl mx-auto mb-2" />
                                        <p className="text-white font-medium text-lg">{item.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition focus:outline-none"
                        onClick={closeLightbox}
                    >
                        &times;
                    </button>
                    <div
                        className="max-w-5xl max-h-[90vh] w-full bg-transparent flex flex-col items-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.imagePath?.startsWith('http') ? selectedImage.imagePath : `${API_URL}${selectedImage.imagePath}`}
                            alt={selectedImage.title}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="mt-4 text-center">
                            <h3 className="text-white text-xl font-medium">{selectedImage.title}</h3>
                            <p className="text-gray-400 text-sm mt-1">{selectedImage.category}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
