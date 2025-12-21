import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 p-4 rounded-full bg-un-blue text-white shadow-lg hover:bg-blue-700 transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                }`}
            aria-label="Scroll to top"
        >
            <FaArrowUp className="text-lg" />
        </button>
    );
};

export default ScrollToTop;
