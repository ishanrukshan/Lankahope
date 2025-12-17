import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import { FaEye, FaBullseye, FaHandshake, FaBalanceScale, FaSpinner } from 'react-icons/fa';
import AOS from 'aos';
import axios from 'axios';

const AboutBackground = () => {
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.refresh();
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/content/about-background');
            setContent(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching content:', error);
            setLoading(false);
        }
    };

    const pillars = [
        {
            title: content.vision?.title || "Vision",
            text: content.vision?.description || "To be the premier national health research organization, driving evidence-based healthcare policies and innovations for a healthier Sri Lanka.",
            icon: <FaEye size={32} className="text-sl-gold" />,
            color: "border-sl-gold"
        },
        {
            title: content.mission?.title || "Mission",
            text: content.mission?.description || "To promote, coordinate, and conduct high-quality health research that addresses national health priorities and contributes to improved health outcomes for all Sri Lankans.",
            icon: <FaBullseye size={32} className="text-sl-maroon" />,
            color: "border-sl-maroon"
        },
        {
            title: content.values?.title || "Core Values",
            text: content.values?.value1 && content.values?.value2
                ? `${content.values.value1}, ${content.values.value2}${content.values.value3 ? ', ' + content.values.value3 : ''}${content.values.value4 ? ', ' + content.values.value4 : ''}${content.values.value5 ? ', ' + content.values.value5 : ''}`
                : "Excellence in Research, Integrity & Ethics, Collaboration & Partnership, Innovation, Transparency & Accountability.",
            icon: <FaHandshake size={32} className="text-sl-gold" />,
            color: "border-sl-gold"
        },
        {
            title: content.mandate?.title || "Mandate",
            text: content.mandate?.description || "To oversee and coordinate all health research activities in Sri Lanka, ensuring ethical standards, capacity building, and the translation of research into policy and practice.",
            icon: <FaBalanceScale size={32} className="text-sl-maroon" />,
            color: "border-sl-maroon"
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-sl-maroon" />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <PageTitle
                title="Background"
                subtitle="Our foundation, vision, and guiding principles"
                breadcrumb={[
                    { label: 'About Us', path: null },
                    { label: 'Background' }
                ]}
            />

            {/* Introduction Section */}
            <section className="py-16 px-4 md:px-12 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-serif text-sl-maroon mb-6">
                        {content.intro?.title || 'About LankaHope'}
                    </h2>
                    <p data-aos="fade-up" data-aos-delay="100" className="text-gray-600 leading-relaxed text-lg">
                        {content.intro?.description || 'LankaHope was established to strengthen the national health research system. Operating under the Ministry of Health, we serve as the apex body for coordinating, promoting, and conducting health research that addresses the nation\'s health priorities and contributes to evidence-based policy making.'}
                    </p>
                </div>
            </section>

            {/* Pillars Section */}
            <section className="py-20 px-4 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p data-aos="fade-up" className="text-sl-gold text-xs font-bold uppercase tracking-widest mb-3">Our Foundation</p>
                        <h2 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-5xl font-serif text-sl-maroon">
                            Guiding Principles
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {pillars.map((pillar, index) => (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                className={`bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 ${pillar.color} group`}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        {pillar.icon}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-2xl font-serif text-sl-maroon mb-3">{pillar.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{pillar.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* History Section */}
            <section className="py-20 px-4 md:px-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div data-aos="fade-right" className="w-full md:w-1/2">
                            <p className="text-sl-gold text-xs font-bold uppercase tracking-widest mb-4">Our Journey</p>
                            <h2 className="text-3xl md:text-4xl font-serif mb-6">
                                {content.legacy?.title || 'A Legacy of Excellence'}
                            </h2>
                            <div className="space-y-4 text-gray-300 leading-relaxed">
                                <p>
                                    {content.legacy?.description || 'Since its inception, LankaHope has been at the forefront of advancing health research in Sri Lanka. Our organization has played a pivotal role in addressing national health challenges through rigorous research and collaboration.'}
                                </p>
                                <p>
                                    Today, we continue to build on this legacy, fostering partnerships with local and international
                                    institutions, training the next generation of health researchers, and ensuring that our work
                                    translates into tangible improvements in healthcare delivery across the nation.
                                </p>
                            </div>
                        </div>
                        <div data-aos="fade-left" data-aos-delay="200" className="w-full md:w-1/2">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center">
                                    <div className="text-4xl font-serif text-sl-gold mb-2">
                                        {content.legacy?.stat1Value || '25+'}
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {content.legacy?.stat1Label || 'Years of Service'}
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center">
                                    <div className="text-4xl font-serif text-sl-gold mb-2">
                                        {content.legacy?.stat2Value || '500+'}
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {content.legacy?.stat2Label || 'Research Projects'}
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center">
                                    <div className="text-4xl font-serif text-sl-gold mb-2">
                                        {content.legacy?.stat3Value || '50+'}
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {content.legacy?.stat3Label || 'Partner Institutions'}
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center">
                                    <div className="text-4xl font-serif text-sl-gold mb-2">
                                        {content.legacy?.stat4Value || '9'}
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {content.legacy?.stat4Label || 'Provinces Covered'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutBackground;
