import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';
import Home from './pages/home';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import TitleBar from './components/titleBar';
import { Toaster } from './components/sonner';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <TitleBar />
      <Toaster />
      <Routes>
        <Route path='/login' element={user ? <Navigate to='/home' /> : <Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={user ? <Home /> : <Navigate to='/login' />} />
        <Route path='/' element={<Navigate to={user ? '/home' : '/login'} />} />
      </Routes>
    </Router>
  );
};

export default App;
