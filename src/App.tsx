import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { DemoBanner } from './components/layout/DemoBanner';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { RadarPage } from './pages/RadarPage';
import { CollaborationsPage } from './pages/CollaborationsPage';
import { ExplorePage } from './pages/ExplorePage';
import { EventsPage } from './pages/EventsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ManageClubPage } from './pages/ManageClubPage';
import { ModerationPage } from './pages/ModerationPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-[#070c1b] text-slate-100 selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <DemoBanner />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/radar" element={<RadarPage />} />
              <Route path="/collaborations" element={<CollaborationsPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/manage-club" element={<ManageClubPage />} />
              <Route path="/moderation" element={<ModerationPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
