import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AboutBackground from './pages/AboutBackground';
import AboutAdministration from './pages/AboutAdministration';
import AboutResearch from './pages/AboutResearch';
import AboutBoard from './pages/AboutBoard';
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
import BoardManager from './pages/admin/BoardManager';

import AOS from 'aos';

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
          <Route path="board" element={<BoardManager />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;

