import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../config/api';
import PageTitle from '../components/PageTitle';
import TeamCard from '../components/TeamCard'; // We might need to check if we can style this or replace it inline for full control
import AOS from 'aos';
import { FaUserPlus } from 'react-icons/fa';

const OurTeam = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.refresh();
        const fetchTeam = async () => {
            try {
                const { data } = await axios.get(API.url('/api/team'));
                setTeam(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching team:', error);
                setLoading(false);
                setTeam([
                    { _id: '1', name: 'Dr. Samantha Perera', title: 'Director General', imagePath: '', bio: 'Leading UNHRO with over 20 years of experience in international human rights law and advocacy.' },
                    { _id: '2', name: 'Mr. Nimal Fernando', title: 'Deputy Director', imagePath: '', bio: 'Expert in civil liberties and constitutional rights with a decade of field experience.' },
                    { _id: '3', name: 'Ms. Kumari Silva', title: 'Head of Legal', imagePath: '', bio: 'Ensuring justice for victims through strategic litigation and legal support.' },
                    { _id: '4', name: 'Mr. Ashan Jayawardena', title: 'Finance Director', imagePath: '', bio: 'Managing financial operations and ensuring transparent resource allocation.' },
                    { _id: '5', name: 'Dr. Priya Wickramasinghe', title: 'Research Coordinator', imagePath: '', bio: 'Coordinating national studies on social justice and policy reform.' },
                    { _id: '6', name: 'Ms. Dilani Rathnayake', title: 'Outreach Manager', imagePath: '', bio: 'Overseeing community engagement and rights education programs.' },
                ]);
            }
        };
        fetchTeam();
    }, []);

    return (
        <div className="bg-white min-h-screen font-sans">
            <PageTitle
                title="Our Team"
                subtitle="The dedicated professionals driving human rights excellence."
                breadcrumb={[
                    { label: 'About Us', path: null },
                    { label: 'Our Team' }
                ]}
            />

            {/* Intro */}
            <section className="py-20 px-6 md:px-12 bg-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-serif text-sl-maroon font-bold mb-8">
                        Leadership & Staff
                    </h2>
                    <p data-aos="fade-up" data-aos-delay="100" className="text-xl text-gray-600 leading-relaxed font-light">
                        Our team comprises dedicated advocates, legal experts, and staff committed to advancing
                        human rights in Sri Lanka. Together, we work towards our mission of protecting human dignity
                        and promoting justice for all.
                    </p>
                </div>
            </section>

            {/* Team Grid - Redesigned to be consistent but Distinct from Board */}
            <section className="pb-24 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-un-blue"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {team.map((member, index) => (
                                <div
                                    key={member._id}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 50}
                                    className="group bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:border-un-blue/30 transition-all duration-300"
                                >
                                    {/* Using inline style/structure instead of potentially outdated TeamCard component for safety */}
                                    <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                                        {member.imagePath ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL || ''}${member.imagePath}`}
                                                alt={member.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                                <span className="text-6xl font-serif">{member.name.charAt(0)}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="text-xs font-bold uppercase tracking-widest bg-un-blue px-2 py-1 inline-block rounded mb-2">{member.title}</p>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-2xl font-serif text-sl-maroon font-bold mb-3">{member.name}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{member.bio}</p>

                                        {/* Optional: Add social or contact icons here if available in data */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Join Us CTA */}
            <section className="py-20 px-6 md:px-12 bg-sl-maroon text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <FaUserPlus className="text-5xl text-un-blue mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Join Our Mission</h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        We are always looking for passionate individuals to join our cause. If you are dedicated to human rights and ready to make a difference, we want to hear from you.
                    </p>
                    <button className="px-10 py-4 bg-un-blue text-white font-bold rounded-lg shadow-lg hover:bg-white hover:text-un-blue transition-all duration-300 uppercase tracking-widest text-sm">
                        View Career Opportunities
                    </button>
                </div>
            </section>
        </div>
    );
};

export default OurTeam;
