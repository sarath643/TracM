import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className='flex items-center justify-between'>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className='p-2 text-gray-800 bg-white rounded-full dark:bg-black dark:text-gray-200'>
        {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
