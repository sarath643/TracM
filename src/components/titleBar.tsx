import React from 'react';
import ThemeSwitcher from './themeSwitcher';
import { GiTakeMyMoney } from 'react-icons/gi';

const TitleBar = () => {
  return (
    <div className='absolute flex justify-center w-screen'>
      <div className='flex items-center justify-between w-full p-4 max-w-7xl'>
        <div className='inline-flex items-center'>
          <GiTakeMyMoney className=' size-12 text-greenT' />
          <p className='text-lg font-black uppercase dark:text-white text-blackT/80'>
            Trac <span className='text-2xl text-greenT'>UM</span>
          </p>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default TitleBar;
