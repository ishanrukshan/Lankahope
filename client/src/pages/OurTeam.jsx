import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../config/api';
import PageTitle from '../components/PageTitle';
import TeamCard from '../components/TeamCard';
import AOS from 'aos';

const OurTeam = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.refresh();
    }, []);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const { data } = await axios.get(API.url('/api/team'));
                setTeam(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching team:', error);
                setLoading(false);
                // Fallback data for demonstration if API fails or is empty
                setTeam([
                    { _id: '1', name: 'Dr. Samantha Perera', title: 'Director General', imagePath: '', bio: 'Leading LankaHope with over 20 years of experience in public health research.' },
                    { _id: '2', name: 'Prof. Nimal Fernando', title: 'Deputy Director - Research', imagePath: '', bio: 'Expert in epidemiological studies and health policy.' },
                    { _id: '3', name: 'Dr. Kumari Silva', title: 'Head of Ethics Committee', imagePath: '', bio: 'Ensuring ethical standards in all research activities.' },
                    { _id: '4', name: 'Mr. Ashan Jayawardena', title: 'Finance Director', imagePath: '', bio: 'Managing financial operations and resource allocation.' },
                    { _id: '5', name: 'Dr. Priya Wickramasinghe', title: 'Research Coordinator', imagePath: '', bio: 'Coordinating multi-institutional research projects.' },
                    { _id: '6', name: 'Ms. Dilani Rathnayake', title: 'HR & Admin Manager', imagePath: '', bio: 'Overseeing human resources and administrative functions.' },
                ]);
            }
        };

        fetchTeam();
    }, []);

    return (
        <div className="bg-white min-h-screen">
            <PageTitle
                title="Our Team"
                subtitle="Meet the dedicated professionals driving health research excellence"
                breadcrumb={[
                    { label: 'About Us', path: null },
                    { label: 'Our Team' }
                ]}
            />

            {/* Introduction */}
            <section className="py-16 px-4 md:px-12 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-serif text-sl-maroon mb-6">
                        Leadership & Staff
                    </h2>
                    <p data-aos="fade-up" data-aos-delay="100" className="text-gray-600 leading-relaxed text-lg">
                        Our team comprises experienced researchers, administrators, and support staff dedicated to advancing
                        health research in Sri Lanka. Together, we work towards our mission of improving health outcomes
                        through evidence-based research and collaboration.
                    </p>
                </div>
            </section>

            {/* Team Grid */}
            <section className="py-20 px-4 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p data-aos="fade-up" className="text-sl-gold text-xs font-bold uppercase tracking-widest mb-3">The People</p>
                        <h2 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-5xl font-serif text-sl-maroon">
                            Meet Our Team
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sl-maroon"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {team.map((member, index) => (
                                <div key={member._id} data-aos="fade-up" data-aos-delay={index * 100}>
                                    <TeamCard member={member} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Join Us Section */}
            <section className="py-20 px-4 md:px-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-serif mb-6">
                        Join Our Team
                    </h2>
                    <p data-aos="fade-up" data-aos-delay="100" className="text-gray-300 leading-relaxed mb-8">
                        We are always looking for talented individuals passionate about health research and making a difference.
                        Explore career opportunities at LankaHope and be part of our mission.
                    </p>
                    <button
                        data-aos="fade-up"
                        data-aos-delay="200"
                        className="px-8 py-3 bg-sl-gold text-white hover:bg-yellow-600 transition-all duration-300 uppercase text-sm tracking-widest font-bold rounded"
                    >
                        View Opportunities
                    </button>
                </div>
            </section>
        </div>
    );
};

export default OurTeam;
