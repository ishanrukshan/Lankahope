import React from 'react';
import { Link } from 'react-router-dom';

const PageTitle = ({ title, subtitle, breadcrumb = [] }) => {
    return (
        <div className="relative w-full h-48 md:h-64 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
            {/* Decorative Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Gold Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sl-gold to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                {/* Breadcrumb */}
                {breadcrumb.length > 0 && (
                    <nav className="mb-4">
                        <ol className="flex items-center space-x-2 text-sm">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-sl-gold transition-colors">
                                    Home
                                </Link>
                            </li>
                            {breadcrumb.map((item, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                    <span className="text-gray-600">/</span>
                                    {item.path ? (
                                        <Link to={item.path} className="text-gray-400 hover:text-sl-gold transition-colors">
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <span className="text-sl-gold">{item.label}</span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-serif text-white font-medium tracking-wide">
                    {title}
                </h1>

                {/* Subtitle */}
                {subtitle && (
                    <p className="mt-3 text-gray-400 text-sm md:text-base max-w-2xl">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PageTitle;
