import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { Eye, EyeOff } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import CustomInput from '../../components/customInput';

import { Button } from '../../components/button';
import { auth } from '../../firebase/config';
import { FcGoogle } from 'react-icons/fc';
import { validateField } from '../../utils/validation';
import Separator from '../../components/seperator';
import { CustomRotatingLoader } from '../../components/loaders';

interface ILoginvalues {
  email: string;
  password: string;
}

const Login = () => {
  //   import { getFirestore, doc, setDoc } from 'firebase/firestore';

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [triggerSubmit, setTriggerSubmit] = useState(false);
  const [formValues, setFormValues] = useState<ILoginvalues>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<ILoginvalues>>({
    email: '',
    password: '',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('User:', user);

      setUser(user);
      if (user) {
        // setEmail(user.email || '');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      //   setUser(result.user);
      //   setEmail(result.user.email || '');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    if (name === 'password') {
      setPassword(value);
    }

    if (triggerSubmit) {
      const error = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setTriggerSubmit(true);
    event.preventDefault();

    const { code, password } = formValues;
    const newErrors: { [key: string]: string } = {};

    Object.entries(formValues).forEach(([key, value]) => {
      const error = validateField(key, value as string);
      console.log(error, 'validateFielderror');
      if (error) {
        newErrors[key] = error;
      }
    });

    console.log(newErrors, 'newErrors');

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // if (user) {
        //   try {
        //     await setDoc(doc(db, 'users', user.uid), {
        //       fullName,
        //       email,
        //       profession,
        //     });
        //     console.log('User data saved successfully');
        //   } catch (error) {
        //     console.error('Error saving user data:', error);
        //   }
        // }
      } catch (error) {}
    }
  };

  return (
    <div className='flex items-center justify-center w-screen min-h-screen transition-colors duration-200 bg-white dark:bg-black'>
      <div className='w-full max-w-lg p-8 bg-white rounded-lg md:shadow-md md:bg-gray-100 dark:bg-black md:dark:bg-gray-900'>
        <div className='mb-6 '>
          <h2 className='text-2xl font-bold text-center text-gray-900 dark:text-white'>Login</h2>
        </div>

        <form onSubmit={handleSubmit} className='space-y-1'>
          <div>
            <CustomInput
              label='Email'
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              onChange={handleChange}
              error={errors.email}
            />
          </div>
          <div className='relative'>
            <CustomInput
              label='Password'
              type={showPassword ? 'text' : 'password'}
              id='password'
              name='password'
              placeholder='Enter your password'
              onChange={handleChange}
              error={errors.password}
            />
            {password.length > 0 && (
              <span
                onClick={togglePasswordVisibility}
                className='absolute transform translate-y-3 cursor-pointer right-3 top-[calc(50%-10px)]'>
                {showPassword ? (
                  <Eye className='size-6 text-greenT/70' />
                ) : (
                  <EyeOff className='size-6 text-greenT/70' />
                )}
              </span>
            )}
          </div>
          <div className=' ml-0.5'>
            <p className='text-sm text-red-500 '></p>
          </div>

          <div className=''>
            <Button
              type='submit'
              variant='accent'
              size='lg'
              className='relative w-full h-12 text-white'>
              Login
              {isLoading && <CustomRotatingLoader className={'left-[calc(60%-10px)] right-0'} />}
            </Button>
          </div>
          <div className='py-5'>
            <Separator orientation='horizontal' className='text-sm '>
              or continue with
            </Separator>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            type='button'
            size='lg'
            className='flex items-center justify-center w-full h-12 space-x-2 text-white transition-colors duration-200 bg-blue-600 rounded-md bg-opacity-60 hover:bg-opacity-50'>
            <FcGoogle size={20} />
            <span>Sign in with Google</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
