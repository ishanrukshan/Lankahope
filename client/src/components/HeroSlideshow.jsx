import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bmichHero from '../assets/bmich_hero.png';
import heroImage1 from '../assets/hero_image.png';

// Using the same image twice if we only have 2, or we can add a placeholder
// ideally we'd want 3 images for a good loop.
const slides = [
    {
        id: 1,
        image: bmichHero,
        title: "Empowering Sri Lanka Through Health Research",
        subtitle: "Coordinating national efforts for a healthier, more resilient tomorrow."
    },
    {
        id: 2,
        image: heroImage1,
        title: "Innovating for a Better Future",
        subtitle: "State-of-the-art facilities and world-class researchers working together in Colombo."
    },
    {
        id: 3,
        image: bmichHero, // Reusing for demo effect
        title: "Evidence-Based Policy Making",
        subtitle: "Generating knowledge to guide national health strategies and interventions for Sri Lanka."
    }
];

const HeroSlideshow = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(slideInterval);
    }, []);

    return (
        <div className="relative w-full h-[600px] overflow-hidden bg-gray-900">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[10000ms]"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    ></div>

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-gradient-to-t from-black/80 via-black/40 to-black/30">
                        <h1 className="text-4xl md:text-7xl font-sans font-bold text-white mb-6 drop-shadow-2xl max-w-5xl leading-tight tracking-tight">
                            {slide.title}
                        </h1>
                        <div className="w-24 h-1 bg-sl-gold mb-8 rounded-full"></div>
                        <p className="text-lg md:text-2xl text-gray-100 mb-10 max-w-3xl font-light drop-shadow-md leading-relaxed">
                            {slide.subtitle}
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                to="/about/background"
                                className="bg-sl-gold hover:bg-sl-maroon text-sl-maroon hover:text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:-translate-y-1 border-2 border-sl-gold hover:border-sl-maroon"
                            >
                                Learn More
                            </Link>
                            <Link
                                to="/about/research-institutions"
                                className="bg-transparent border-2 border-white hover:border-sl-gold hover:bg-sl-gold hover:text-sl-maroon text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:-translate-y-1"
                            >
                                Our Research
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-sl-gold w-8' : 'bg-gray-400 hover:bg-white'
                            }`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default HeroSlideshow;
