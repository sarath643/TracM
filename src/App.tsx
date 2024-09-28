import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';

import TitleBar from './components/titleBar';
import { Toaster } from './components/sonner';
import Auth from './pages/auth';
import { CustomDotLoader } from './components/loaders';
import Footer from './components/footer';
import Dashboard from './pages/home';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';
import ReportAI from './pages/report/reportAI';

const App = () => {
  const { user, loading, isProfileComplete } = useAuth();

  const { isDarkMode, setIsDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center w-screen h-screen bg-white dark:bg-black '>
        <div className='flex items-center justify-center h-16 pb-4'>
          <CustomDotLoader numberOfDots={6} className='w-2 h-2' />
        </div>
      </div>
    );
  }

  console.log(user, 'isProfileComplete:', isProfileComplete);

  return (
    <Router>
      <TitleBar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <Toaster />
      <Routes>
        <Route path='/auth' element={user ? <Navigate to='/dashboard' /> : <Auth />} />
        <Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to='/auth' />} />
        <Route path='/report' element={user ? <ReportAI /> : <Navigate to='/auth' />} />
        <Route path='*' element={<Navigate to={user ? '/dashboard' : '/auth'} />} />
      </Routes>
      {user && <Footer isComplete={isProfileComplete} />}
    </Router>
  );
};

export default App;
