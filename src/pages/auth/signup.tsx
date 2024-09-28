import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@components/button';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import Seperator from '@components/seperator';
import SignupForm, { ISignUpvalues } from './signupForm';
import CustomToast from '@/components/customToast';
import { FaArrowRight } from 'react-icons/fa';
import { auth, db } from '@/firebase/config';

interface SignupProps {
  onSwitch: () => void;
}

const SignUp: React.FC<SignupProps> = ({ onSwitch }) => {
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formApiError, setFormApiError] = useState<string>('');
  const navigate = useNavigate();

  const handleSignUpForm = async (values: ISignUpvalues) => {
    setIsLoading(true);
    setError('');
    setFormApiError('');
    console.log(values, 'values');
    try {
      const { email, password, fullName, profession } = values;

      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            fullName: fullName,
            email: user.email,
            profession: profession,
            isProfileComplete: true,
          });
          CustomToast('Profile created successfully!', 'success');
          setTimeout(() => {
            CustomToast(`Welcome ${fullName}!`, 'success');
          }, 2000);
          navigate('/dashboard');
        } catch (error) {
          console.log(error);
          setFormApiError((error as Error)?.message);
          setIsLoading(false);
        }
      } else {
        setFormApiError('No user logged in');
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setFormApiError((error as Error)?.message);
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          fullName: user.displayName,
          email: user.email,
          isProfileComplete: false,
        });
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      setError((error as Error)?.message);
    }
  };

  return (
    <div className='mt-10 mb-6 space-y-4 '>
      <h2 className='text-2xl font-bold text-center text-gray-900 dark:text-white'>Sign Up</h2>

      <SignupForm handleSignUpForm={handleSignUpForm} isLoading={isloading} error={formApiError} />

      <div className=''>
        <Seperator orientation='horizontal' className='text-sm '>
          or
        </Seperator>
      </div>

      <Button
        onClick={handleGoogleSignup}
        type='button'
        size='lg'
        className='flex items-center justify-center w-full h-12 space-x-2 text-white transition-colors duration-200 bg-blue-600 rounded-md bg-opacity-60 hover:bg-opacity-50'>
        <FcGoogle size={20} />
        <span>Sign Up with Google</span>
      </Button>

      <p className='text-sm text-red-500 dark:text-red-500 '>{error}</p>

      <div className='pt-2'>
        <div className='flex items-center justify-end gap-2 text-sm text-right'>
          <p> Already have an account?</p>

          <p
            onClick={onSwitch}
            className='flex items-center gap-1 text-base transition duration-100 text-greenT dark:text-greenT hover:scale-110'>
            Login <FaArrowRight className='text-greenT' />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
