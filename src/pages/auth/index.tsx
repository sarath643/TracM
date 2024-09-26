import React, { useState } from 'react';
import Login from './login';
import SignUp from './signup';

const Auth = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className='flex items-center justify-center w-screen min-h-screen transition-colors duration-200 bg-white dark:bg-black'>
      <div className='w-full max-w-lg p-8 bg-white rounded-lg md:shadow-md md:bg-gray-100 dark:bg-black md:dark:bg-gray-900'>
        {isLogin ? <Login onSwitch={handleSwitch} /> : <SignUp onSwitch={handleSwitch} />}
      </div>
    </div>
  );
};

export default Auth;
