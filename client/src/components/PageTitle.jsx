import React from 'react';
import { Link } from 'react-router-dom';

const PageTitle = ({ title, subtitle, breadcrumb = [] }) => {
    return (
        <div className="w-full bg-gray-50 border-b border-gray-200 py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Breadcrumb */}
                {breadcrumb.length > 0 && (
                    <nav className="mb-6" data-aos="fade-down" data-aos-duration="800">
                        <ol className="flex items-center space-x-3 text-xs md:text-sm font-bold tracking-widest uppercase">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-un-blue transition-colors">
                                    Home
                                </Link>
                            </li>
                            {breadcrumb.map((item, index) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <span className="text-gray-300">/</span>
                                    {item.path ? (
                                        <Link to={item.path} className="text-gray-400 hover:text-un-blue transition-colors">
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <span className="text-un-blue">{item.label}</span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                <div className="max-w-4xl">
                    {/* Title */}
                    <h1
                        className="text-4xl md:text-6xl font-serif text-sl-maroon font-bold mb-6 leading-tight"
                        data-aos="fade-up"
                        data-aos-duration="800"
                        data-aos-delay="100"
                    >
                        {title}
                    </h1>

                    {/* Subtitle */}
                    {subtitle && (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-un-blue flex-shrink-0" data-aos="fade-right" data-aos-delay="300"></div>
                            <p
                                className="text-gray-500 text-lg md:text-xl font-light leading-relaxed"
                                data-aos="fade-up"
                                data-aos-delay="200"
                            >
                                {subtitle}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageTitle;
