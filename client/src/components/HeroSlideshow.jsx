import React, { useState, useEffect } from 'react';
import API from '../config/api';

const HeroSlideshow = ({ images = [], fallbackImage, interval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loaded, setLoaded] = useState(false);

    // Filter valid images and ensure we have an array
    const validImages = images.filter(img => img && img.url);

    useEffect(() => {
        if (validImages.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length);
        }, interval);

        return () => clearInterval(timer);
    }, [validImages.length, interval]);

    // Preload next image for smoother transitions
    useEffect(() => {
        if (validImages.length <= 1) return;
        const nextIndex = (currentIndex + 1) % validImages.length;
        const img = new Image();
        img.src = API.imageUrl(validImages[nextIndex].url);
    }, [currentIndex, validImages]);

    // If no images from API, show fallback
    if (validImages.length === 0) {
        return (
            <div
                className="absolute inset-0 bg-cover bg-center animate-hero-bg transition-opacity duration-1000"
                style={{ backgroundImage: `url(${fallbackImage})` }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
            </div>
        );
    }

    return (
        <>
            {validImages.map((image, index) => (
                <div
                    key={image._id || index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{ backgroundImage: `url(${API.imageUrl(image.url)})` }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
            ))}
        </>
    );
};

export default HeroSlideshow;
