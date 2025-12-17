import React, { useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import { FaUserTie, FaUsers, FaBuilding, FaCogs } from 'react-icons/fa';
import AOS from 'aos';

const AboutAdministration = () => {
    useEffect(() => {
        AOS.refresh();
    }, []);

    const departments = [
        {
            title: "Office of the Director General",
            description: "Provides strategic leadership and oversees all operations of LankaHope, ensuring alignment with national health research priorities.",
            icon: <FaUserTie size={28} className="text-sl-gold" />
        },
        {
            title: "Research Coordination Division",
            description: "Coordinates research activities across institutions, manages research grants, and ensures quality standards in all research projects.",
            icon: <FaCogs size={28} className="text-sl-gold" />
        },
        {
            title: "Ethics & Compliance Unit",
            description: "Oversees ethical review processes, ensures research compliance with national and international standards, and protects research participants.",
            icon: <FaBuilding size={28} className="text-sl-gold" />
        },
        {
            title: "Capacity Building & Training",
            description: "Develops and implements training programs for health researchers, fostering the next generation of research leaders in Sri Lanka.",
            icon: <FaUsers size={28} className="text-sl-gold" />
        }
    ];

    const leadership = [
        { role: "Director General", name: "To be appointed", responsibility: "Chief Executive Officer" },
        { role: "Deputy Director", name: "To be appointed", responsibility: "Research Operations" },
        { role: "Head of Ethics", name: "To be appointed", responsibility: "Ethics & Compliance" },
        { role: "Finance Director", name: "To be appointed", responsibility: "Financial Management" }
    ];

    return (
        <div className="bg-white min-h-screen">
            <PageTitle 
                title="Administration" 
                subtitle="Our organizational structure and leadership"
                breadcrumb={[
                    { label: 'About Us', path: null },
                    { label: 'Administration' }
                ]}
            />

            {/* Organizational Structure */}
            <section className="py-20 px-4 md:px-12 bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p data-aos="fade-up" className="text-sl-gold text-xs font-bold uppercase tracking-widest mb-3">Structure</p>
                        <h2 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-5xl font-serif text-sl-maroon">
                            Organizational Framework
                        </h2>
                        <p data-aos="fade-up" data-aos-delay="200" className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            LankaHope operates under a structured framework designed to ensure efficient coordination of health research activities across Sri Lanka.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {departments.map((dept, index) => (
                            <div 
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-sl-maroon group"
                            >
                                <div className="w-14 h-14 rounded-full bg-sl-maroon/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {dept.icon}
                                </div>
                                <h3 className="text-xl font-serif text-sl-maroon mb-3">{dept.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{dept.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership Team */}
            <section className="py-20 px-4 md:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p data-aos="fade-up" className="text-sl-gold text-xs font-bold uppercase tracking-widest mb-3">Leadership</p>
                        <h2 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-5xl font-serif text-sl-maroon">
                            Executive Team
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {leadership.map((leader, index) => (
                            <div 
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 hover:border-sl-gold transition-all duration-300"
                            >
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-sl-maroon to-sl-maroon/80 flex items-center justify-center">
                                    <FaUserTie size={32} className="text-white" />
                                </div>
                                <h4 className="font-serif text-lg text-sl-maroon font-medium">{leader.role}</h4>
                                <p className="text-gray-800 font-medium mt-2">{leader.name}</p>
                                <p className="text-gray-500 text-sm mt-1">{leader.responsibility}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Governance */}
            <section className="py-20 px-4 md:px-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <p data-aos="fade-up" className="text-sl-gold text-xs font-bold uppercase tracking-widest mb-3">Governance</p>
                    <h2 data-aos="fade-up" data-aos-delay="100" className="text-3xl md:text-4xl font-serif mb-6">
                        Board of Directors
                    </h2>
                    <p data-aos="fade-up" data-aos-delay="200" className="text-gray-300 leading-relaxed mb-8">
                        LankaHope is governed by a Board of Directors comprising distinguished professionals from the health sector, 
                        academia, and public administration. The Board provides strategic oversight and ensures that the organization 
                        fulfills its mandate effectively.
                    </p>
                    <div data-aos="fade-up" data-aos-delay="300" className="inline-flex items-center space-x-2 text-sl-gold">
                        <span className="text-sm uppercase tracking-widest">Board composition details coming soon</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutAdministration;
