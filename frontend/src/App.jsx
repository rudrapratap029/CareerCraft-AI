import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { SkillChartsPage } from './pages/SkillChartsPage';
import { RoadmapGeneratorPage } from './pages/RoadmapGeneratorPage';
import { InterviewPracticePage } from './pages/InterviewPracticePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-darkBg text-slate-400 text-sm">
        <span>Loading CareerCraft AI...</span>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume-analyzer"
                element={
                  <ProtectedRoute>
                    <ResumeAnalyzerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skill-charts"
                element={
                  <ProtectedRoute>
                    <SkillChartsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap-generator"
                element={
                  <ProtectedRoute>
                    <RoadmapGeneratorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview-practice"
                element={
                  <ProtectedRoute>
                    <InterviewPracticePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
