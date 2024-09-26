import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';
import Home from './pages/home';

import TitleBar from './components/titleBar';
import { Toaster } from './components/sonner';
import Auth from './pages/auth';
import { CustomDotLoader } from './components/loaders';
import Footer from './components/footer';

const App = () => {
  const { user, loading, isProfileComplete } = useAuth();

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
      <TitleBar />
      <Toaster />
      <Routes>
        <Route path='/auth' element={user ? <Navigate to='/home' /> : <Auth />} />
        <Route path='/home' element={user ? <Home /> : <Navigate to='/auth' />} />
        <Route path='*' element={<Navigate to={user ? '/home' : '/auth'} />} />
      </Routes>
      {user && <Footer isComplete={isProfileComplete} />}
    </Router>
  );
};

export default App;
