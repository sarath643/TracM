import React, { useEffect, useState } from 'react';
import { GiTakeMyMoney } from 'react-icons/gi';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { LogOut } from 'lucide-react';
import { Moon, Sun } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface TitleBarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const TitleBar = ({ toggleTheme, isDarkMode }: TitleBarProps) => {
  const [showTooltip, setShowTooltip] = useState<string | boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setShowTooltip(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };
  return (
    <div className='absolute z-10 flex justify-center w-screen'>
      <div className='flex items-center justify-between w-full p-4 max-w-7xl'>
        <div
          className={`inline-flex items-center ${
            location.pathname == '/report' && 'cursor-pointer'
          }`}
          onClick={() => location.pathname == '/report' && navigate('/dashboard')}>
          <GiTakeMyMoney className=' size-12 text-greenT' />
          <p className='text-lg font-black uppercase dark:text-white text-blackT/80'>
            Trac <span className='text-2xl text-greenT'>M</span>
          </p>
        </div>
        <div className='flex items-center space-x-2 sm:space-x-4'>
          {location.pathname != '/auth' && (
            <div
              className='relative group'
              onMouseEnter={() => setShowTooltip('logout')}
              onMouseLeave={() => setShowTooltip(false)}>
              <button className='p-2 text-gray-800 bg-white rounded-full dark:bg-black dark:text-gray-200'>
                <LogOut
                  size={20}
                  onClick={handleLogout}
                  className='text-gray-800 bg-white rounded-full cursor-pointer dark:bg-black dark:text-gray-200'
                />
              </button>
              {showTooltip === 'logout' && (
                <div className='absolute p-2 text-xs text-white bg-gray-500 rounded-md shadow-md -bottom-9 -right-2 '>
                  Logout
                </div>
              )}
            </div>
          )}

          <div
            className='relative group'
            onMouseEnter={() => setShowTooltip('theme')}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => toggleTheme()}>
            <button className='p-2 text-gray-800 bg-white rounded-full dark:bg-black dark:text-gray-200'>
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {showTooltip === 'theme' && (
              <div className='absolute p-2 text-xs text-white bg-gray-500 rounded-md shadow-md -bottom-9 -right-1 '>
                {isDarkMode ? 'Dark' : 'Light'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
