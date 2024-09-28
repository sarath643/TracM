import {
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import CustomInput from '@components/customInput';

import { Button } from '@components/button';
import { FcGoogle } from 'react-icons/fc';
import Separator from '@components/seperator';
import { CustomRotatingLoader } from '@components/loaders';
import { FaArrowRight } from 'react-icons/fa';
import { auth, db } from '@/firebase/config';
import { validateField } from '@/utils/validation';
import CustomToast from '@/components/customToast';
import { doc, getDoc } from 'firebase/firestore';

interface ILoginvalues {
  email: string;
  password: string;
}

interface LoginProps {
  onSwitch: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitch }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [triggerSubmit, setTriggerSubmit] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<ILoginvalues>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<ILoginvalues>>({
    email: '',
    password: '',
  });

  const [apiError, setApiError] = useState<string>('');
  const [googleError, setGoogleError] = useState<string>('');

  const handleGoogleSignIn = async () => {
    setApiError('');
    setGoogleError('');
    try {
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User signed in:', user);
    } catch (error) {
      setGoogleError((error as Error)?.message);
      console.error('Error signing in with Google:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiError('');
    setGoogleError('');
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
    setIsLoading(true);
    setTriggerSubmit(true);
    setGoogleError('');
    setApiError('');
    event.preventDefault();

    const newErrors: { [key: string]: string } = {};

    Object.entries(formValues).forEach(([key, value]) => {
      const error = validateField(key, value as string);
      console.log(error, 'validateFielderror');
      if (error) {
        newErrors[key as keyof ILoginvalues] = error;
      }
    });

    console.log(newErrors, 'newErrors');

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await signInWithEmailAndPassword(auth, formValues.email, formValues.password);
        console.log('User signed in successfully');

        const user = auth.currentUser;
        if (user) {
          console.log('User signed in:', user);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const fullName = userData.fullName;
            CustomToast(`Welcome ${fullName}`, 'success');
          } else {
            console.log('No user data found in Firestore');
          }
        }
      } catch (error) {
        setApiError((error as Error)?.message);
        setIsLoading(false);
        console.error('Error signing in:', error);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className='mb-6 '>
      <h2 className='text-2xl font-bold text-center text-gray-900 dark:text-white'>Login</h2>

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
              className='absolute transform translate-y-3 cursor-pointer right-4 top-[calc(50%-18px)]'>
              {showPassword ? (
                <Eye className='size-5 text-greenT/70' />
              ) : (
                <EyeOff className='size-5 text-greenT/70' />
              )}
            </span>
          )}
        </div>
        <div className='ml-1 min-h-1'>
          <p className='text-sm text-red-500 dark:text-red-500 '>{apiError}</p>
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
        <div className='py-3'>
          <Separator orientation='horizontal' className='text-sm '>
            or
          </Separator>
        </div>

        <div className='ml-1 '>
          <p className='text-sm text-red-500 dark:text-red-500 '>{googleError}</p>
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

      <div className='mt-10'>
        <div className='flex items-center justify-end gap-2 text-sm text-right'>
          <p> Don't have an account?</p>

          <p
            onClick={onSwitch}
            className='flex items-center gap-1 text-base transition duration-100 text-greenT dark:text-greenT hover:scale-110'>
            Sign Up
            <FaArrowRight className='text-greenT' />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
