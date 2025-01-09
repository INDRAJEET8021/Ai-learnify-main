import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter
import { AuthProvider } from './components/AuthContext/AuthContext';

// Import pages
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/UserDashboard';
import CourseContentPage from './pages/CourseContentPage';
import AdaptiveQuizPage from './pages/AdaptiveQuizPage';
import Chatbot from './pages/Chatbot';
import EducatorDashboard from './pages/EducatorDashboard';
import AuthPage from './pages/AuthPage';
import AdaptiveLearning from './pages/AdaptiveLearning';
import CourseDetails from './components/courses/CourseDetails';
import ScrollProgress from './components/courses/ScrollProgress';
import QuizReport from './components/quizes/QuizReport';
import Footer from './components/Footer'; // Import Footer

function App() {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline /> {/* For Material-UI Global Styles */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/course" element={<CourseContentPage />} />
            <Route path="/quiz" element={<AdaptiveQuizPage />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/progress" element={<AdaptiveLearning />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/course-details/:courseId" element={<CourseDetails />} />
            <Route path="/quiz-report" element={<QuizReport />} />
          </Routes>
          <Footer /> {/* Footer placed at the bottom */}
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;
