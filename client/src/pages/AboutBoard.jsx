import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import PageTitle from '../components/PageTitle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AboutBoard = () => {
    const [boardMembers, setBoardMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.refresh();
        fetchBoardMembers();
    }, []);

    const fetchBoardMembers = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/board`);
            setBoardMembers(data);
        } catch (error) {
            console.error('Error fetching board members:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <PageTitle
                title="Board / Committee"
                subtitle="Governance and oversight of LankaHope"
                breadcrumb={[
                    { label: 'About Us', path: null },
                    { label: 'Board / Committee' }
                ]}
            />

            <section className="py-16 px-4 md:px-12 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-serif text-sl-maroon mb-6">
                        Governing Board
                    </h2>
                    <p data-aos="fade-up" data-aos-delay="100" className="text-gray-600 leading-relaxed text-lg">
                        The Board of Directors provides strategic direction and oversight for LankaHope,
                        ensuring that the organization fulfills its mandate to advance health research in Sri Lanka.
                    </p>
                </div>
            </section>

            <section className="py-20 px-4 md:px-12">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-sl-maroon border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-600">Loading board members...</p>
                        </div>
                    ) : boardMembers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No board members found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {boardMembers.map((member, index) => (
                                <div
                                    key={member._id}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                    className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                                >
                                    <div className="h-80 w-full overflow-hidden relative bg-gray-100">
                                        {member.imagePath ? (
                                            <>
                                                <img
                                                    src={`${API_URL}${member.imagePath}`}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sl-maroon to-sl-maroon/80">
                                                <span className="text-white text-6xl font-serif opacity-50">{member.name.charAt(0)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 text-center relative">
                                        {/* Decorative line */}
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-sl-gold"></div>

                                        <h3 className="font-serif text-2xl text-sl-maroon font-bold mb-2 group-hover:text-sl-gold transition-colors duration-300">
                                            {member.name}
                                        </h3>
                                        <div className="text-lg font-medium text-gray-800 mb-3 uppercase tracking-wide text-sm">
                                            {member.role}
                                        </div>
                                        {member.organization && (
                                            <p className="text-gray-500 text-base italic border-t border-gray-100 pt-3 mt-1 inline-block px-4">
                                                {member.organization}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AboutBoard;
