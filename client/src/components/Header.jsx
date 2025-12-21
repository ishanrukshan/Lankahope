import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCaretDown, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import logo from '../assets/logo-blue.png';

// WhatsApp donation link helper
const getWhatsAppDonateLink = () => {
    const phoneNumber = '94777911177'; // Sri Lankan number in international format
    const message = "Hello! I'm interested in supporting UNHRO. Could you please provide me with information on how I can make a donation? Thank you!";
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

const Header = () => {
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);

    // Scroll state for Home page header
    const [isScrolled, setIsScrolled] = useState(false);

    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleMobileAbout = () => setIsMobileAboutOpen(!isMobileAboutOpen);

    // Handle scroll effect only on Home page
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        if (isHomePage) {
            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Check initial state
        } else {
            setIsScrolled(false); // Reset for other pages
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    // Common Navigation Links 
    const NavLinks = ({ mobile = false }) => (
        <>
            <li className={`w-full ${mobile ? '' : 'lg:w-auto text-center'}`}>
                <Link to="/" className={`block py-2 px-3 rounded-lg ${mobile ? 'text-left' : 'lg:py-3 lg:px-1.5 xl:px-3'} text-xs xl:text-sm font-bold transition-colors duration-300 ease-in-out ${isHomePage && !isScrolled && !mobile ? 'text-white hover:text-un-blue' : 'text-gray-700 hover:text-un-blue'}`}>
                    HOME
                </Link>
            </li>

            {/* Dropdown */}
            <li
                className={`relative group w-full ${mobile ? '' : 'lg:w-auto text-center'}`}
                onMouseEnter={() => !mobile && setIsAboutOpen(true)}
                onMouseLeave={() => !mobile && setIsAboutOpen(false)}
            >
                <button
                    onClick={mobile ? toggleMobileAbout : undefined}
                    className={`flex items-center w-full ${mobile ? 'justify-start text-left' : 'justify-center lg:w-auto'} py-2 px-3 rounded-lg ${mobile ? '' : 'lg:py-3 lg:px-1.5 xl:px-3'} text-xs xl:text-sm font-bold transition-colors duration-300 ease-in-out focus:outline-none ${isHomePage && !isScrolled && !mobile ? 'text-white hover:text-un-blue' : 'text-gray-700 hover:text-un-blue'}`}
                >
                    ABOUT US <FaCaretDown className={`ml-1 transform transition-transform duration-300 ${(mobile ? isMobileAboutOpen : isAboutOpen) ? 'rotate-180' : ''} ${isHomePage && !isScrolled && !mobile ? 'text-un-blue' : 'text-gray-400 group-hover:text-sl-maroon'}`} />
                </button>

                {/* Dropdown Menu */}
                <div className={`${mobile ? (isMobileAboutOpen ? 'block' : 'hidden') : 'hidden group-hover:block'} ${mobile ? 'static w-full bg-gray-50 pl-4' : 'absolute top-full left-1/2 transform -translate-x-1/2 w-56 bg-gray-800/95 backdrop-blur-sm shadow-xl rounded-b-lg border-t-2 border-un-blue'} transition-all duration-300 z-50`}>
                    <Link to="/about/background" className={`block px-5 py-3 text-sm ${mobile ? 'text-gray-600 hover:bg-gray-100 hover:text-sl-maroon border-l-4 border-transparent hover:border-sl-maroon hover:pl-6' : 'text-gray-200 hover:bg-gray-700 hover:text-un-blue'} transition-all duration-300 ease-in-out transform hover:translate-x-1`}>About UNHRO</Link>
                    <Link to="/about/leadership" className={`block px-5 py-3 text-sm ${mobile ? 'text-gray-600 hover:bg-gray-100 hover:text-sl-maroon border-l-4 border-transparent hover:border-sl-maroon hover:pl-6' : 'text-gray-200 hover:bg-gray-700 hover:text-un-blue'} transition-all duration-300 ease-in-out transform hover:translate-x-1`}>Leadership</Link>
                    <Link to="/about/team" className={`block px-5 py-3 text-sm ${mobile ? 'text-gray-600 hover:bg-gray-100 hover:text-sl-maroon border-l-4 border-transparent hover:border-sl-maroon hover:pl-6' : 'text-gray-200 hover:bg-gray-700 hover:text-un-blue'} transition-all duration-300 ease-in-out transform hover:translate-x-1`}>Our Team</Link>
                    <Link to="/about/impact" className={`block px-5 py-3 text-sm ${mobile ? 'text-gray-600 hover:bg-gray-100 hover:text-sl-maroon border-l-4 border-transparent hover:border-sl-maroon hover:pl-6' : 'text-gray-200 hover:bg-gray-700 hover:text-un-blue rounded-b-lg'} transition-all duration-300 ease-in-out transform hover:translate-x-1`}>Our Impact</Link>
                </div>
            </li>

            <li className={`w-full ${mobile ? '' : 'lg:w-auto text-center'}`}>
                <Link to="/resources" className={`block py-2 px-3 rounded-lg ${mobile ? 'text-left' : 'lg:py-3 lg:px-1.5 xl:px-3'} text-xs xl:text-sm font-bold transition-colors duration-300 ease-in-out ${isHomePage && !isScrolled && !mobile ? 'text-white hover:text-un-blue' : 'text-gray-700 hover:text-un-blue'}`}>
                    RESOURCES
                </Link>
            </li>
            <li className={`w-full ${mobile ? '' : 'lg:w-auto text-center'}`}>
                <Link to="/symposium" className={`block py-2 px-3 rounded-lg ${mobile ? 'text-left' : 'lg:py-3 lg:px-1.5 xl:px-3'} text-xs xl:text-sm font-bold transition-colors duration-300 ease-in-out ${isHomePage && !isScrolled && !mobile ? 'text-white hover:text-un-blue' : 'text-gray-700 hover:text-un-blue'}`}>
                    SYMPOSIUM
                </Link>
            </li>
            <li className={`w-full ${mobile ? '' : 'lg:w-auto text-center'}`}>
                <Link to="/news-events" className={`block py-2 px-3 rounded-lg ${mobile ? 'text-left' : 'lg:py-3 lg:px-1.5 xl:px-3'} text-xs xl:text-sm font-bold transition-colors duration-300 ease-in-out ${isHomePage && !isScrolled && !mobile ? 'text-white hover:text-un-blue' : 'text-gray-700 hover:text-un-blue'}`}>
                    NEWS & EVENTS
                </Link>
            </li>
            <li className={`w-full ${mobile ? '' : 'lg:w-auto text-center'}`}>
                <Link to="/gallery" className={`block py-2 px-3 rounded-lg ${mobile ? 'text-left' : 'lg:py-3 lg:px-1.5 xl:px-3'} text-xs xl:text-sm font-bold transition-colors duration-300 ease-in-out ${isHomePage && !isScrolled && !mobile ? 'text-white hover:text-un-blue' : 'text-gray-700 hover:text-un-blue'}`}>
                    GALLERY
                </Link>
            </li>
            <li className={`w-full ${mobile ? '' : 'lg:w-auto text-center'}`}>
                <Link to="/contact" className={`block py-2 px-3 rounded-lg ${mobile ? 'text-left' : 'lg:py-3 lg:px-1.5 xl:px-3'} text-xs xl:text-sm font-bold transition-colors duration-300 ease-in-out ${isHomePage && !isScrolled && !mobile ? 'text-white hover:text-un-blue' : 'text-gray-700 hover:text-un-blue'}`}>
                    CONTACT US
                </Link>
            </li>
        </>
    );

    // --- HOME PAGE HEADER (Transparent / Sticky) --- from "UNHRO" style
    // --- HOME PAGE HEADER (Transparent / Sticky) --- from "UNHRO" style
    if (isHomePage) {
        return (
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 group/header animate-slide-down delay-500 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-3'}`}>
                <div className="container mx-auto px-4 lg:px-6 xl:px-12 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0">
                        <img src={logo} alt="UNHRO Logo" className="h-10 lg:h-12 object-contain" />
                        <span className={`text-xl lg:text-2xl font-serif font-bold tracking-wide ${isScrolled ? 'text-sl-maroon' : 'text-white'}`}>
                            UNHRO
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden lg:block">
                        <ul className="flex space-x-1 xl:space-x-4 items-center">
                            <NavLinks mobile={false} />
                            {/* Donate Button (from design) */}
                            <li>
                                <a
                                    href={getWhatsAppDonateLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block text-center font-serif font-bold py-1.5 lg:py-2 px-3 lg:px-4 xl:px-6 text-xs xl:text-sm rounded transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl border-2 bg-un-blue border-un-blue text-white hover:bg-blue-700 hover:border-blue-700 hover:shadow-blue-500/50 active:scale-95"
                                >
                                    Donate
                                </a>
                            </li>
                        </ul>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`lg:hidden focus:outline-none p-2 will-change-transform ${isScrolled ? 'text-sl-maroon' : 'text-white'}`}
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <div key="close" className="text-2xl">✕</div> : <div key="open" className="text-2xl">☰</div>}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <div className={`lg:hidden bg-white shadow-lg absolute top-full left-0 w-full overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                    <ul className="flex flex-col p-4 space-y-2">
                        <NavLinks mobile={true} />
                        <li>
                            <a
                                href={getWhatsAppDonateLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-un-blue border-2 border-un-blue text-white font-serif font-bold py-3 px-6 rounded hover:bg-blue-700 hover:border-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 active:scale-95 mt-4"
                            >
                                Donate
                            </a>
                        </li>
                    </ul>
                </div>
            </header>
        );
    }

    // --- STANDARD HEADER (Inner Pages) - Same as Home but with white background ---
    return (
        <header className="sticky top-0 w-full z-50 bg-white shadow-md py-2">
            <div className="container mx-auto px-4 lg:px-6 xl:px-12 flex justify-between items-center">
                {/* Logo - Same as Home */}
                <Link to="/" className="flex items-center gap-3 shrink-0">
                    <img src={logo} alt="UNHRO Logo" className="h-10 lg:h-12 object-contain" />
                    <span className="text-xl lg:text-2xl font-serif font-bold tracking-wide text-sl-maroon">
                        UNHRO
                    </span>
                </Link>

                {/* Desktop Menu - Same as Home */}
                <nav className="hidden lg:block">
                    <ul className="flex space-x-1 xl:space-x-4 items-center">
                        <NavLinks mobile={false} />
                        {/* Donate Button */}
                        <li>
                            <a
                                href={getWhatsAppDonateLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-center font-serif font-bold py-1.5 lg:py-2 px-3 lg:px-4 xl:px-6 text-xs xl:text-sm rounded transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl border-2 bg-un-blue border-un-blue text-white hover:bg-blue-700 hover:border-blue-700 hover:shadow-blue-500/50 active:scale-95"
                            >
                                Donate
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden text-sl-maroon focus:outline-none p-2 will-change-transform"
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? <div key="close" className="text-2xl">✕</div> : <div key="open" className="text-2xl">☰</div>}
                </button>
            </div>

            {/* Mobile Menu Dropdown - Same as Home */}
            <div className={`lg:hidden bg-white shadow-lg absolute top-full left-0 w-full overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="flex flex-col p-4 space-y-2">
                    <NavLinks mobile={true} />
                    <li>
                        <a
                            href={getWhatsAppDonateLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-un-blue border-2 border-un-blue text-white font-serif font-bold py-3 px-6 rounded hover:bg-blue-700 hover:border-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 active:scale-95 mt-4"
                        >
                            Donate
                        </a>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;
