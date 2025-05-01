import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import ProfileForm from './components/ProfileForm';
import ProfileList from './components/ProfileList';
import IntroAnimation from './components/IntroAnimation';
import { useEffect, useState } from 'react';
import './App.css'

function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Reset showIntro to true on every refresh
    setShowIntro(true);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <motion.div 
                className="flex-shrink-0 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  College Connect
                </Link>
              </motion.div>
              <div className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/create-profile"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Profile
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={showIntro ? <IntroAnimation /> : <ProfileList />} />
            <Route path="/profiles" element={<ProfileList />} />
            <Route path="/create-profile" element={<ProfileForm />} />
          </Routes>
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
          error: {
            duration: 3000,
            theme: {
              primary: '#ff4b4b',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
