import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AboutBackground from './pages/AboutBackground';
import AboutAdministration from './pages/AboutAdministration';
import AboutResearch from './pages/AboutResearch';
import OurTeam from './pages/OurTeam';
import Resources from './pages/Resources';
import Symposium from './pages/Symposium';
import NewsEvents from './pages/NewsEvents';
import EventDetails from './pages/EventDetails';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import PageTitle from './components/PageTitle';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TeamManager from './pages/admin/TeamManager';
import EventsManager from './pages/admin/EventsManager';
import AnnouncementsManager from './pages/admin/AnnouncementsManager';
import ContentManager from './pages/admin/ContentManager';
import ImageManager from './pages/admin/ImageManager';
import GalleryManager from './pages/admin/GalleryManager';
import SettingsManager from './pages/admin/SettingsManager';

import AOS from 'aos';

// Board/Committee Page
const AboutBoard = () => {
  useEffect(() => {
    AOS.refresh();
  }, []);

  const boardMembers = [
    { name: "Chairman Name", role: "Board Chairman", organization: "Ministry of Health" },
    { name: "Member Name", role: "Board Member", organization: "Medical Council of Sri Lanka" },
    { name: "Member Name", role: "Board Member", organization: "University of Colombo" },
    { name: "Member Name", role: "Board Member", organization: "University of Peradeniya" },
    { name: "Member Name", role: "Board Member", organization: "Ministry of Finance" },
    { name: "Member Name", role: "Secretary", organization: "LankaHope" },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boardMembers.map((member, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-sl-gold text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-sl-maroon to-sl-maroon/80 flex items-center justify-center">
                  <span className="text-white text-xl font-serif">{member.name.charAt(0)}</span>
                </div>
                <h3 className="font-serif text-lg text-sl-maroon font-medium">{member.name}</h3>
                <p className="text-sl-gold text-sm font-medium mt-1">{member.role}</p>
                <p className="text-gray-500 text-sm mt-2">{member.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Wrapper for Public Routes to apply Layout
const PublicLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Wrapped in Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about/background" element={<AboutBackground />} />
          <Route path="/about/administration" element={<AboutAdministration />} />
          <Route path="/about/research-institutions" element={<AboutResearch />} />
          <Route path="/about/team" element={<OurTeam />} />
          <Route path="/about/board" element={<AboutBoard />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/symposium" element={<Symposium />} />
          <Route path="/symposium" element={<Symposium />} />
          <Route path="/news-events" element={<NewsEvents />} />
          <Route path="/news-events/:id" element={<EventDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin Routes - No Public Layout */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route path="team" element={<TeamManager />} />
          <Route path="events" element={<EventsManager />} />
          <Route path="announcements" element={<AnnouncementsManager />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="images" element={<ImageManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
