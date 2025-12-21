import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import { FaEye, FaBullseye, FaHandshake, FaBalanceScale, FaSpinner, FaHistory, FaLandmark } from 'react-icons/fa';
import AOS from 'aos';
import axios from 'axios';
import API from '../config/api';

const AboutBackground = () => {
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.refresh();
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const { data } = await axios.get(API.url('/api/content/about-background'));
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
            text: content.vision?.description || "To be Sri Lanka's leading voice for human rights, ensuring dignity, equality, and justice for every citizen.",
            icon: <FaEye size={40} className="text-un-blue" />,
            color: "border-un-blue"
        },
        {
            title: content.mission?.title || "Mission",
            text: content.mission?.description || "To protect, promote, and advocate for fundamental human rights through education, legal support, and community engagement across Sri Lanka.",
            icon: <FaBullseye size={40} className="text-un-blue" />,
            color: "border-un-blue"
        },
        {
            title: content.values?.title || "Core Values",
            text: content.values?.value1 && content.values?.value2
                ? `${content.values.value1}, ${content.values.value2}${content.values.value3 ? ', ' + content.values.value3 : ''}${content.values.value4 ? ', ' + content.values.value4 : ''}${content.values.value5 ? ', ' + content.values.value5 : ''}`
                : "Justice & Equality, Integrity & Ethics, Collaboration & Partnership, Inclusivity, Transparency & Accountability.",
            icon: <FaHandshake size={40} className="text-un-blue" />,
            color: "border-un-blue"
        },
        {
            title: content.mandate?.title || "Mandate",
            text: content.mandate?.description || "To monitor human rights conditions, provide legal assistance, advocate for policy reforms, and empower communities to understand and exercise their rights.",
            icon: <FaBalanceScale size={40} className="text-un-blue" />,
            color: "border-un-blue"
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-un-blue" />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans">
            <PageTitle
                title="About UNHRO"
                subtitle="Championing human rights, dignity, and justice for all."
                breadcrumb={[
                    { label: 'About Us', path: null },
                    { label: 'About UNHRO' }
                ]}
            />

            {/* Introduction Section with Split Layout */}
            <section className="py-24 px-6 md:px-12 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-un-blue/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-sl-maroon/5 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
                    <div className="w-full md:w-1/2" data-aos="fade-right">
                        <div className="inline-block px-3 py-1 bg-un-blue/10 text-un-blue text-sm font-bold uppercase tracking-widest mb-6 rounded-full">
                            Who We Are
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-sl-maroon font-bold mb-6 leading-tight">
                            About UNHRO
                        </h2>
                        <div className="w-20 h-1.5 bg-un-blue mb-8"></div>
                        <p className="text-gray-600 leading-relaxed text-lg mb-6 text-justify">
                            UNHRO Sri Lanka was established to safeguard the fundamental rights of all citizens. Operating as an independent body, we serve as the primary advocate for justice, equality, and dignity, working tirelessly to monitor human rights violations, provide legal redress, and promote education and awareness across the nation.
                        </p>
                    </div>
                    <div className="w-full md:w-1/2" data-aos="fade-left">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                            {/* Placeholder for realistic office/team image if available, else decorative pattern */}
                            <div className="aspect-video bg-gradient-to-br from-gray-900 to-un-blue p-8 flex items-center justify-center">
                                <FaLandmark className="text-white/20 text-9xl" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                                    <h3 className="text-3xl font-serif font-bold mb-2">Our Commitment</h3>
                                    <p className="max-w-xs text-white/80">To build a future where every voice is heard and every right protected.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pillars Section - Floating Cards */}
            <section className="py-24 px-6 md:px-12 bg-[#F8F9FA]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-serif text-sl-maroon font-bold mb-6">
                            Guiding Principles
                        </h2>
                        <p data-aos="fade-up" data-aos-delay="100" className="text-gray-600 text-lg">
                            The core values and mission that drive every initiative we undertake.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {pillars.map((pillar, index) => (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                className="bg-white p-10 rounded-xl shadow-lg border-l-8 border-un-blue hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-un-blue/5 flex items-center justify-center group-hover:bg-un-blue group-hover:text-white transition-colors duration-300">
                                        {React.cloneElement(pillar.icon, { className: "group-hover:text-white transition-colors duration-300 " + pillar.icon.props.className })}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-serif text-sl-maroon mb-3 font-bold group-hover:text-un-blue transition-colors duration-300">{pillar.title}</h3>
                                        <p className="text-gray-600 leading-relaxed text-lg">{pillar.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* History Timeline Section */}
            <section className="py-24 px-6 md:px-12 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row gap-16">
                        <div className="md:w-1/3">
                            <div className="sticky top-24">
                                <div className="inline-block p-4 rounded-full bg-white/10 mb-6 text-un-blue">
                                    <FaHistory size={32} />
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                                    Our Legacy
                                </h2>
                                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                    From humble beginnings to a national force for human rights, UNHRO's journey has been defined by unwavering resilience and dedication to justice and equality for all Sri Lankans.
                                </p>
                                <button className="px-8 py-3 bg-un-blue text-white font-bold rounded hover:bg-white hover:text-un-blue transition-all duration-300 uppercase tracking-widest text-sm">
                                    Read Full Story
                                </button>
                            </div>
                        </div>

                        <div className="md:w-2/3 space-y-8 relative border-l border-white/20 pl-8 md:pl-12 ml-4 md:ml-0">
                            {[
                                { year: '2010', title: 'Establishment', text: 'Founded with a clear mandate to protect civil liberties.' },
                                { year: '2015', title: 'National Expansion', text: 'Expanded operations to cover all 25 districts of Sri Lanka.' },
                                { year: '2018', title: 'Global Partnership', text: 'Recognized by international bodies for excellence in advocacy.' },
                                { year: '2023', title: 'Digital Era', text: 'Launched digital reporting platforms to modernize rights monitoring.' }
                            ].map((item, idx) => (
                                <div key={idx} className="relative group" data-aos="fade-up" data-aos-delay={idx * 100}>
                                    <span className="absolute -left-[41px] md:-left-[58px] top-1 w-5 h-5 rounded-full bg-un-blue border-4 border-gray-900 group-hover:scale-150 transition-transform duration-300"></span>
                                    <span className="text-un-blue font-bold text-lg mb-1 block">{item.year}</span>
                                    <h3 className="text-2xl font-serif font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-400">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutBackground;
