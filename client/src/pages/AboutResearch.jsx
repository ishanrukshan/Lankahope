import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import { FaFlask, FaHospital, FaUniversity, FaMicroscope, FaGlobe, FaLeaf, FaSpinner } from 'react-icons/fa';
import AOS from 'aos';
import axios from 'axios';
import API from '../config/api';

const AboutResearch = () => {
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.refresh();
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const { data } = await axios.get(API.url('/api/content/about-research'));
            setContent(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching content:', error);
            setLoading(false);
        }
    };

    const institutions = [
        {
            name: "Medical Research Institute",
            shortName: "MRI",
            description: "The premier public health laboratory in Sri Lanka, conducting research on infectious diseases, immunology, and diagnostic services.",
            icon: <FaFlask size={32} className="text-white" />,
            color: "from-sl-maroon to-red-800",
            location: "Colombo"
        },
        {
            name: "National Institute of Health Sciences",
            shortName: "NIHS",
            description: "Focuses on health systems research, health policy analysis, and training of healthcare professionals.",
            icon: <FaUniversity size={32} className="text-white" />,
            color: "from-sl-gold to-yellow-600",
            location: "Kalutara"
        },
        {
            name: "National Cancer Research Institute",
            shortName: "NCRI",
            description: "Dedicated to cancer research, epidemiology, and developing innovative treatment approaches for oncological conditions.",
            icon: <FaMicroscope size={32} className="text-white" />,
            color: "from-sl-maroon to-red-800",
            location: "Maharagama"
        },
        {
            name: "Bandaranaike Memorial Ayurvedic Research Institute",
            shortName: "BMARI",
            description: "Research on traditional Ayurvedic medicine, herbal remedies, and integration of traditional healing practices with modern healthcare.",
            icon: <FaLeaf size={32} className="text-white" />,
            color: "from-sl-gold to-yellow-600",
            location: "Nawinna"
        },
        {
            name: "National Institute of Mental Health",
            shortName: "NIMH",
            description: "Conducts research on mental health conditions, psychiatric disorders, and community mental health interventions.",
            icon: <FaHospital size={32} className="text-white" />,
            color: "from-sl-maroon to-red-800",
            location: "Angoda"
        },
        {
            name: "International Collaborations",
            shortName: "Global",
            description: "Partnerships with WHO, international universities, and global health organizations for collaborative research initiatives.",
            icon: <FaGlobe size={32} className="text-white" />,
            color: "from-sl-gold to-yellow-600",
            location: "Worldwide"
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
                title="Research Institutions"
                subtitle="Our network of research excellence across Sri Lanka"
                breadcrumb={[
                    { label: 'About Us', path: null },
                    { label: 'Research Institutions' }
                ]}
            />

            {/* Introduction */}
            <section className="py-16 px-4 md:px-12 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-serif text-sl-maroon mb-6">
                        {content.intro?.title || 'A Network of Excellence'}
                    </h2>
                    <p data-aos="fade-up" data-aos-delay="100" className="text-gray-600 leading-relaxed text-lg">
                        {content.intro?.description || 'LankaHope coordinates with a network of premier research institutions across Sri Lanka. These institutions form the backbone of our national health research infrastructure, each contributing specialized expertise to address the country\'s health challenges.'}
                    </p>
                </div>
            </section>

            {/* Institutions Grid */}
            <section className="py-20 px-4 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p data-aos="fade-up" className="text-sl-gold text-xs font-bold uppercase tracking-widest mb-3">Partner Institutions</p>
                        <h2 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-5xl font-serif text-sl-maroon">
                            Research Centers
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {institutions.map((inst, index) => (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                            >
                                {/* Header with Icon */}
                                <div className={`bg-gradient-to-r ${inst.color} p-6 text-white`}>
                                    <div className="flex items-center justify-between">
                                        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            {inst.icon}
                                        </div>
                                        <span className="text-2xl font-serif font-bold opacity-80">{inst.shortName}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-lg font-serif text-sl-maroon mb-2">{inst.name}</h3>
                                    <p className="text-gray-500 text-sm mb-4 flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-sl-gold mr-2"></span>
                                        {inst.location}
                                    </p>
                                    <p className="text-gray-600 text-sm leading-relaxed">{inst.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-4 md:px-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-serif mb-6">
                        {content.collaboration?.title || 'Collaborate With Us'}
                    </h2>
                    <p data-aos="fade-up" data-aos-delay="100" className="text-gray-300 leading-relaxed mb-8">
                        {content.collaboration?.description || 'We welcome partnerships with academic institutions, healthcare organizations, and international bodies. Together, we can advance health research and improve health outcomes for Sri Lanka.'}
                    </p>
                    <button
                        data-aos="fade-up"
                        data-aos-delay="200"
                        className="px-8 py-3 bg-sl-gold text-white hover:bg-yellow-600 transition-all duration-300 uppercase text-sm tracking-widest font-bold rounded"
                    >
                        Contact Us
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AboutResearch;
