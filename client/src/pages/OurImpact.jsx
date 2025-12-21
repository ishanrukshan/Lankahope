import React, { useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import PageTitle from '../components/PageTitle';
import { FaUsers, FaGavel, FaGraduationCap, FaHandHoldingHeart, FaCheckCircle, FaMapMarkerAlt, FaGlobe, FaRegChartBar } from 'react-icons/fa';
import CountUp from 'react-countup';

// Custom hook for intersection observer
const useInView = () => {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return [ref, isInView];
};

const OurImpact = () => {
    const [statsRef, counterOn] = useInView();

    useEffect(() => {
        AOS.refresh();
    }, []);

    const impactStats = [
        { number: 5000, suffix: "+", label: "Cases Addressed", icon: <FaGavel size={40} /> },
        { number: 25, suffix: "", label: "Districts Covered", icon: <FaMapMarkerAlt size={40} /> },
        { number: 10000, suffix: "+", label: "People Educated", icon: <FaGraduationCap size={40} /> },
        { number: 100, suffix: "+", label: "Community Programs", icon: <FaHandHoldingHeart size={40} /> }
    ];

    const achievements = [
        { title: "Legal Aid Expansion", desc: "Established legal aid centers in 15 underserved districts.", year: "2023" },
        { title: "Advocacy Network", desc: "Trained 500+ community advocates to monitor local rights.", year: "2022" },
        { title: "Policy Impact", desc: "Published annual human rights report cited by national policy makers.", year: "2024" },
        { title: "Global Alliance", desc: "Partnered with 3 major international organizations for funding.", year: "2021" },
        { title: "Youth Education", desc: "Conducted awareness programs in over 200 schools nationwide.", year: "2023" },
        { title: "Emergency Support", desc: "Provided free legal assistance to 1,000+ vulnerable families.", year: "2024" }
    ];

    return (
        <div className="bg-white min-h-screen font-sans">
            <PageTitle
                title="Our Impact"
                subtitle="Quantifying our commitment to a just society."
                breadcrumb={[
                    { label: 'About Us', path: null },
                    { label: 'Our Impact' }
                ]}
            />

            {/* Impact Statistics Hero */}
            <section ref={statsRef} className="py-24 px-6 md:px-12 bg-gradient-to-br from-gray-900 to-sl-maroon text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <p data-aos="fade-up" className="text-un-blue text-sm font-bold uppercase tracking-widest mb-4">By The Numbers</p>
                        <h2 data-aos="fade-up" data-aos-delay="100" className="text-5xl md:text-6xl font-serif font-bold">
                            Tangible Change
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
                        {impactStats.map((stat, index) => (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                className="text-center p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="flex justify-center mb-6 text-un-blue group-hover:scale-110 transition-transform duration-300">
                                    {stat.icon}
                                </div>
                                <div className="text-5xl font-bold mb-2 font-serif">
                                    {counterOn && <CountUp start={0} end={stat.number} duration={2.5} delay={0} />}
                                    {stat.suffix}
                                </div>
                                <div className="text-gray-300 font-bold text-sm uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Key Achievements Grid */}
            <section className="py-24 px-6 md:px-12 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                        <div>
                            <p data-aos="fade-up" className="text-un-blue text-sm font-bold uppercase tracking-widest mb-3">Milestones</p>
                            <h2 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-5xl font-serif text-sl-maroon font-bold">
                                Key Achievements
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {achievements.map((item, index) => (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 50}
                                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-t-8 border-gray-100 hover:border-un-blue group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <FaCheckCircle className="text-un-blue text-2xl mt-1" />
                                    <span className="text-gray-200 text-4xl font-black group-hover:text-gray-100 transition-colors cursor-default">{item.year}</span>
                                </div>
                                <h3 className="text-xl font-bold text-sl-maroon mb-3 font-serif">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Transparency Section */}
            <section className="py-24 px-6 md:px-12 bg-white">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2" data-aos="fade-right">
                        <div className="relative">
                            <div className="absolute top-0 left-0 w-20 h-20 bg-un-blue/10 rounded-full -ml-10 -mt-10"></div>
                            <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800" alt="Transparency" className="rounded-lg shadow-2xl relative z-10 filter grayscale hover:grayscale-0 transition-all duration-500" />
                        </div>
                    </div>
                    <div className="md:w-1/2" data-aos="fade-left">
                        <FaRegChartBar className="text-un-blue text-4xl mb-6" />
                        <h2 className="text-4xl font-serif font-bold text-sl-maroon mb-6">Transparency & Accountability</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            We believe that trust is earned through transparency. UNHRO publishes annual financial reports and impact assessments, ensuring that every contribution is accounted for and directed towards meaningful change.
                        </p>
                        <button className="text-un-blue font-bold uppercase tracking-widest text-sm border-b-2 border-un-blue hover:text-sl-maroon hover:border-sl-maroon transition-colors pb-1">
                            View Reports
                        </button>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-6 md:px-12 bg-gray-900 text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <FaUsers size={48} className="mx-auto mb-6 text-un-blue" />
                    <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-serif font-bold mb-6">
                        Be the Change
                    </h2>
                    <p data-aos="fade-up" data-aos-delay="100" className="text-gray-300 text-lg mb-10 leading-relaxed">
                        Your support empowers us to reach more communities, fight more cases, and educate more citizens. Join us in our mission to protect human rights for all.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <a
                            href="/get-involved"
                            data-aos="fade-up"
                            data-aos-delay="200"
                            className="px-10 py-4 bg-un-blue text-white uppercase text-sm tracking-widest font-bold hover:bg-white hover:text-un-blue transition-all duration-300 rounded shadow-lg shadow-un-blue/30"
                        >
                            Get Involved
                        </a>
                        <a
                            href="/contact"
                            data-aos="fade-up"
                            data-aos-delay="300"
                            className="px-10 py-4 bg-transparent border-2 border-white text-white uppercase text-sm tracking-widest font-bold hover:bg-white hover:text-gray-900 transition-all duration-300 rounded"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OurImpact;
