import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import PageTitle from '../components/PageTitle';
import { FaUserTie, FaUsers, FaBuilding, FaCogs, FaSpinner, FaArrowRight } from 'react-icons/fa';
import API from '../config/api';

const API_URL = import.meta.env.VITE_API_URL || '';

const Leadership = () => {
    const [boardMembers, setBoardMembers] = useState([]);
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.refresh();
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [boardRes, contentRes] = await Promise.all([
                axios.get(`${API_URL}/api/board`),
                axios.get(API.url('/api/content/about-administration'))
            ]);
            setBoardMembers(boardRes.data);
            setContent(contentRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const departments = [
        {
            title: content.hierarchy?.dept1Title || "Office of the Director General",
            description: content.hierarchy?.dept1Description || "Provides strategic leadership and oversees all operations of UNHRO.",
            icon: <FaUserTie size={32} className="text-white" />
        },
        {
            title: content.hierarchy?.dept2Title || "Human Rights Division",
            description: content.hierarchy?.dept2Description || "Coordinates human rights activities, manages advocacy programs, and ensures quality standards.",
            icon: <FaCogs size={32} className="text-white" />
        },
        {
            title: content.hierarchy?.dept3Title || "Legal & Compliance Unit",
            description: content.hierarchy?.dept3Description || "Provides legal support, ensures compliance with national and international standards.",
            icon: <FaBuilding size={32} className="text-white" />
        },
        {
            title: content.hierarchy?.dept4Title || "Community Outreach",
            description: content.hierarchy?.dept4Description || "Develops community programs and implements awareness initiatives across Sri Lanka.",
            icon: <FaUsers size={32} className="text-white" />
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
                title="Leadership"
                subtitle="Strategic governance and organizational structure."
                breadcrumb={[
                    { label: 'About Us', path: null },
                    { label: 'Leadership' }
                ]}
            />

            {/* Board Members - Executive Grid (Preserved & Enhanced) */}
            <section className="py-24 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <p data-aos="fade-up" className="text-un-blue text-sm font-bold uppercase tracking-widest mb-4">Governance</p>
                        <h2 data-aos="fade-up" data-aos-delay="100" className="text-5xl md:text-6xl font-serif text-sl-maroon font-bold mb-6">
                            Board of Directors
                        </h2>
                        <p data-aos="fade-up" data-aos-delay="200" className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
                            Our Board provides strategic direction and oversight, ensuring UNHRO fulfills its mandate effectively with integrity and vision.
                        </p>
                    </div>

                    {boardMembers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Board member details coming soon.</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-16">
                            {boardMembers.map((member, index) => (
                                <div
                                    key={member._id}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                    className="group text-center w-full sm:w-[350px]"
                                >
                                    <div className="relative w-72 h-72 mx-auto mb-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                                        <div className="absolute inset-0 rounded-2xl bg-un-blue/10 transform rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                                        <div className="absolute inset-0 rounded-2xl bg-gray-900/5 transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500"></div>
                                        {member.imagePath ? (
                                            <img
                                                src={`${API_URL}${member.imagePath}`}
                                                alt={member.name}
                                                className="relative w-full h-full object-cover object-top rounded-2xl shadow-xl"
                                            />
                                        ) : (
                                            <div className="relative w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl border border-gray-200">
                                                <span className="text-un-blue text-6xl font-serif opacity-30">{member.name.charAt(0)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative px-4">
                                        <h3 className="font-serif text-3xl text-sl-maroon font-bold mb-2 group-hover:text-un-blue transition-colors duration-300">
                                            {member.name}
                                        </h3>
                                        <div className="w-16 h-1.5 bg-un-blue mx-auto mb-4 rounded-full"></div>
                                        <div className="text-sm font-bold text-gray-900 uppercase tracking-[0.2em] mb-2">
                                            {member.role}
                                        </div>
                                        {member.organization && (
                                            <p className="text-gray-500 text-base font-medium font-serif italic">{member.organization}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Organizational Structure - Modern Cards */}
            <section className="py-24 px-6 md:px-12 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                        <div className="max-w-2xl">
                            <p data-aos="fade-up" className="text-un-blue text-sm font-bold uppercase tracking-widest mb-3">Structure</p>
                            <h2 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-5xl font-serif text-sl-maroon font-bold">
                                Operational Departments
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {departments.map((dept, index) => (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                className="group relative bg-white p-10 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-un-blue/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-un-blue/10 transition-colors duration-300"></div>

                                <div className="flex items-start gap-6 relative z-10">
                                    <div className="w-16 h-16 rounded-lg bg-un-blue flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        {dept.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-serif text-sl-maroon font-bold mb-3">{dept.title}</h3>
                                        <p className="text-gray-600 leading-relaxed mb-4">{dept.description}</p>
                                        <div className="flex items-center text-un-blue font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                                            Learn More <FaArrowRight className="ml-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Leadership;
