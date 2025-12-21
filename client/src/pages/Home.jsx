import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API from '../config/api';
import bmichImage from '../assets/bmich.jfif';
import HeroSlideshow from '../components/HeroSlideshow';
import chairmanImage from '../assets/chirmen.jpg';
import { FaArrowRight, FaMapMarkerAlt, FaSchool, FaEye, FaBullseye, FaBalanceScale, FaFlag, FaNewspaper, FaCalendarAlt } from 'react-icons/fa';

const Home = () => {
    const [content, setContent] = useState({});
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const { data } = await axios.get(API.url('/api/content/home'));
                setContent(data);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        const fetchImages = async () => {
            try {
                const { data } = await axios.get(API.url('/api/images/page/home'));
                setImages(data);
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
        fetchImages();
    }, []);

    // Helper to get content with fallback
    const get = (section, key, fallback) => {
        return content[section]?.[key] || fallback;
    };

    // Helper to get images by section
    const getImage = (sectionId) => {
        const image = images.find(img => img.sectionId === sectionId);
        return image ? API.imageUrl(image.url) : null;
    };

    return (
        <div className="font-sans text-gray-800">
            {/* 1. Hero Section - Full Screen Cinematic */}
            <section className="relative h-screen w-full overflow-hidden">
                {/* Background Slideshow */}
                <HeroSlideshow
                    images={images.filter(img => img.sectionId === 'hero')}
                    fallbackImage={bmichImage}
                />

                {/* Dark Overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/50 z-[5]"></div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-0">
                    <p className="text-white/80 uppercase tracking-[0.3em] font-medium mb-4 text-xs md:text-sm animate-fade-in-up delay-700">
                        {get('hero', 'tagline', 'The Pearl of the Indian Ocean')}
                    </p>
                    <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up delay-900 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                        <span className="text-white">{get('hero', 'title', 'United Nations')}</span><br />
                        <span className="text-white">{get('hero', 'titleHighlight', 'Human Rights Organization')}</span>
                    </h1>
                    <p className="text-gray-200 text-sm md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-fade-in-up delay-1100">
                        {get('hero', 'description', 'Championing human dignity, protecting fundamental freedoms, and advocating for justice across Sri Lanka and beyond.')}
                    </p>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 animate-fade-in-up delay-1300">
                        <Link to="/about/background" className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 uppercase text-xs tracking-widest font-bold">
                            {get('hero', 'button1Text', 'Our Mission')}
                        </Link>
                        <Link to="/contact" className="px-8 py-3 bg-un-blue text-white hover:bg-blue-600 transition-all duration-300 uppercase text-xs tracking-widest font-bold">
                            {get('hero', 'button2Text', 'Get Involved')}
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-fade-in delay-1500 animate-bounce opacity-70">
                    <FaArrowRight className="rotate-90" />
                </div>
            </section>

            {/* 2. Mission Statement - Minimalist Serif */}
            <section className="py-24 bg-[#FAFAFA] text-center px-6">
                <div className="max-w-4xl mx-auto">
                    <h3 data-aos="fade-up" className="font-serif text-3xl md:text-4xl text-un-blue italic mb-4">{get('commitment', 'greeting', '"ආයුබෝවන්"')}</h3>
                    <h2 data-aos="fade-up" data-aos-delay="100" className="font-serif text-4xl md:text-5xl text-sl-maroon font-bold mb-8">{get('commitment', 'title', 'A Commitment to Excellence')}</h2>
                    <p data-aos="fade-up" data-aos-delay="200" className="text-gray-500 leading-loose text-sm md:text-base font-light mx-auto max-w-3xl">
                        {get('commitment', 'description', 'Since 2010, UNHRO has operated at the intersection of cultural preservation and community development. We believe that true progress honors the past while embracing the future. Guided by our core values of integrity, cultural respect, and community empowerment, we strive to build a resilient nation. Our goal is to expand our reach to every district, ensuring that our initiatives in healthcare, education, and heritage preservation touch the lives of millions, fostering sustainable growth and a brighter tomorrow for all Sri Lankans.')}
                    </p>
                </div>
            </section>

            {/* 3. Chairman's Message - Premium Side-by-Side */}
            <section className="py-24 bg-white px-4 md:px-12">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                        {/* Image Side */}
                        <div data-aos="fade-right" className="w-full md:w-1/2 relative">
                            <div className="absolute top-4 -left-4 w-full h-full border-2 border-un-blue/30 z-0"></div>
                            <div className="relative z-10 aspect-[4/3] overflow-hidden rounded-sm shadow-2xl">
                                <img
                                    src={getImage('chairman') || chairmanImage}
                                    alt="Chairman"
                                    className="w-full h-full object-cover object-top hover:scale-105 transition-all duration-700"
                                />
                            </div>
                        </div>

                        {/* Text Side */}
                        <div data-aos="fade-left" data-aos-delay="200" className="w-full md:w-1/2">
                            <p className="text-un-blue text-xs font-bold uppercase tracking-[0.2em] mb-6">{get('chairman', 'sectionTitle', "Chairman's Message")}</p>
                            <h2 className="text-4xl md:text-5xl font-serif text-sl-maroon mb-8 leading-tight font-bold">
                                {get('chairman', 'heading', 'Guiding the Nation Towards Healthier Horizons')}
                            </h2>
                            <div className="space-y-6 text-gray-600 font-light leading-relaxed">
                                <p>
                                    <span className="text-5xl float-left mr-4 font-serif text-un-blue/50">"</span>
                                    {get('chairman', 'quote', 'Our mission is not merely to construct buildings or fund research; it is to weave a fabric of resilience across Sri Lanka. Every initiative we undertake is a thread in that tapestry, connecting our proud heritage with a healthier, more prosperous future.')}
                                </p>
                                <p>
                                    {get('chairman', 'message', 'As we look forward, we remain steadfast in our commitment to transparency, excellence, and the unwavering belief that the health of our nation is the foundation of its strength.')}
                                </p>
                            </div>

                            <div className="mt-10 border-t border-gray-100 pt-8">
                                <h4 className="font-serif text-xl text-gray-900 font-bold">{get('chairman', 'name', 'Hon. Chairman Name')}</h4>
                                <p className="text-un-blue text-sm tracking-widest uppercase mt-1">{get('chairman', 'title', 'Chairman, UNHRO')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Strategic Pillars - Vision, Mission, Values, Goals */}
            <section className="py-24 bg-[#FAF9F6] border-t border-gray-100 px-4 md:px-12">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <p data-aos="fade-up" className="text-un-blue text-xs font-bold uppercase tracking-widest mb-3">Our Foundation</p>
                        <h2 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-5xl font-serif text-sl-maroon font-bold">The Pillars of Our Purpose</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Vision */}
                        <div data-aos="fade-up" data-aos-delay="0" className="bg-white p-8 rounded-sm shadow-sm hover:shadow-xl transition-shadow duration-300 border-t-4 border-un-blue group">
                            <div className="mb-6 text-un-blue text-4xl group-hover:scale-110 transition-transform duration-300"><FaEye /></div>
                            <h3 className="font-serif text-2xl text-sl-maroon mb-4">Vision</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                A world where every individual enjoys their fundamental human rights, living with dignity, freedom, and equality.
                            </p>
                        </div>

                        {/* Mission */}
                        <div data-aos="fade-up" data-aos-delay="100" className="bg-white p-8 rounded-sm shadow-sm hover:shadow-xl transition-shadow duration-300 border-t-4 border-un-blue group">
                            <div className="mb-6 text-un-blue text-4xl group-hover:scale-110 transition-transform duration-300"><FaBullseye /></div>
                            <h3 className="font-serif text-2xl text-sl-maroon mb-4">Mission</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                To protect and promote human rights through advocacy, education, legal support, and community empowerment across Sri Lanka.
                            </p>
                        </div>

                        {/* Values */}
                        <div data-aos="fade-up" data-aos-delay="200" className="bg-white p-8 rounded-sm shadow-sm hover:shadow-xl transition-shadow duration-300 border-t-4 border-un-blue group">
                            <div className="mb-6 text-un-blue text-4xl group-hover:scale-110 transition-transform duration-300"><FaBalanceScale /></div>
                            <h3 className="font-serif text-2xl text-sl-maroon mb-4">Values</h3>
                            <ul className="text-gray-500 text-sm leading-loose">
                                <li className="border-b border-gray-100 pb-1 mb-1">Justice & Equality</li>
                                <li className="border-b border-gray-100 pb-1 mb-1">Dignity & Respect</li>
                                <li className="border-b border-gray-100 pb-1 mb-1">Transparency</li>
                                <li>Accountability</li>
                            </ul>
                        </div>

                        {/* Goals */}
                        <div data-aos="fade-up" data-aos-delay="300" className="bg-white p-8 rounded-sm shadow-sm hover:shadow-xl transition-shadow duration-300 border-t-4 border-un-blue group">
                            <div className="mb-6 text-un-blue text-4xl group-hover:scale-110 transition-transform duration-300"><FaFlag /></div>
                            <h3 className="font-serif text-2xl text-sl-maroon mb-4">Goals</h3>
                            <ul className="text-gray-500 text-sm leading-loose">
                                <li className="border-b border-gray-100 pb-1 mb-1">Protect Rights in All Districts</li>
                                <li className="border-b border-gray-100 pb-1 mb-1">Educate 1M+ Citizens</li>
                                <li className="border-b border-gray-100 pb-1 mb-1">Strengthen Legal Support</li>
                                <li>International Advocacy</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Latest News & Updates */}
            <section className="py-24 bg-white border-t border-gray-100 px-4 md:px-12">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <p data-aos="fade-up" className="text-un-blue text-xs font-bold uppercase tracking-widest mb-3">Stay Informed</p>
                        <h2 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-5xl font-serif text-sl-maroon font-bold">Latest News & Updates</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* News Card 1 */}
                        <div data-aos="fade-up" data-aos-delay="0" className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                            <div className="h-48 bg-un-blue/10 flex items-center justify-center">
                                <FaNewspaper className="text-6xl text-un-blue/40" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center text-gray-400 text-xs mb-3">
                                    <FaCalendarAlt className="mr-2" />
                                    <span>December 20, 2025</span>
                                </div>
                                <h3 className="font-serif text-xl text-sl-maroon mb-3 group-hover:text-un-blue transition-colors">Annual Human Rights Summit 2025</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4">Join us for our flagship event bringing together advocates, legal experts, and community leaders.</p>
                                <Link to="/news-events" className="text-un-blue text-sm font-bold uppercase tracking-wide hover:underline">Read More →</Link>
                            </div>
                        </div>

                        {/* News Card 2 */}
                        <div data-aos="fade-up" data-aos-delay="100" className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                            <div className="h-48 bg-un-blue/10 flex items-center justify-center">
                                <FaNewspaper className="text-6xl text-un-blue/40" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center text-gray-400 text-xs mb-3">
                                    <FaCalendarAlt className="mr-2" />
                                    <span>December 15, 2025</span>
                                </div>
                                <h3 className="font-serif text-xl text-sl-maroon mb-3 group-hover:text-un-blue transition-colors">New Legal Aid Center Opens in Colombo</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4">Expanding our reach to provide free legal assistance to vulnerable communities in the capital.</p>
                                <Link to="/news-events" className="text-un-blue text-sm font-bold uppercase tracking-wide hover:underline">Read More →</Link>
                            </div>
                        </div>

                        {/* News Card 3 */}
                        <div data-aos="fade-up" data-aos-delay="200" className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                            <div className="h-48 bg-un-blue/10 flex items-center justify-center">
                                <FaNewspaper className="text-6xl text-un-blue/40" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center text-gray-400 text-xs mb-3">
                                    <FaCalendarAlt className="mr-2" />
                                    <span>December 10, 2025</span>
                                </div>
                                <h3 className="font-serif text-xl text-sl-maroon mb-3 group-hover:text-un-blue transition-colors">Human Rights Day Celebrations</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4">Commemorating International Human Rights Day with community workshops and awareness programs.</p>
                                <Link to="/news-events" className="text-un-blue text-sm font-bold uppercase tracking-wide hover:underline">Read More →</Link>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/news-events" className="inline-block px-8 py-3 bg-un-blue text-white uppercase text-sm tracking-widest font-bold hover:bg-blue-700 transition-all duration-300 rounded">
                            View All News
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
