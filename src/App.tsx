import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from 'sonner';
import NavBar from './components/NavBar';
import HomePage from './pages/index';
import UploadPage from './pages/upload';
import DashboardPage from './pages/dashboard';
import CompaniesPage from './pages/companies';
import CompanyDetailPage from './pages/company-detail';

function App() {
  return (
    <TooltipProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <NavBar />
          <main className="relative">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/company/:id" element={<CompanyDetailPage />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </TooltipProvider>
  );
}

export default App;