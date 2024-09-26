import React from 'react';
import CustomToast from '../../components/customToast';
import { db } from '../../firebase/config';

const Home = () => {
  const test = () => {
    CustomToast('Hi User', 'success');
    console.log(db, 'db');
  };

  return (
    <div className='flex items-center justify-center w-screen min-h-screen transition-colors duration-200 bg-white dark:bg-black'>
      <div className='w-full max-w-lg p-8 bg-white rounded-lg md:shadow-md md:bg-gray-100 dark:bg-black md:dark:bg-gray-900'>
        <div className='mb-6 space-y-4 '>
          <h2
            onClick={test}
            className='text-2xl font-bold text-center text-gray-900 dark:text-white'>
            Home
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
