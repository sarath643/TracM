import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, User, getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import CustomInput from '../../components/customInput';
import { Button } from '../../components/button';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import CustomModal from '../../components/customModal';
import { isEmptyValue } from '../../utils/validation';

const Signup = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const [profession, setProfession] = useState('');

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();

    try {
      // Sign in using Google
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      console.log(user, 'userrr');
      setProfession('');
      setError('');
      setShowPopup(true);
    } catch (error) {
      console.log(error);

      setError(error?.message);
    }
  };

  const handleProfileCompletion = async () => {
    const user = auth.currentUser;
    let error = '';

    console.log(profession);

    if (user) {
      try {
        error = await isEmptyValue(profession, 'profession');
        console.log(error);

        if (error) {
          setError(error);
          return;
        }

        // Save user details and profession to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          fullName: user.displayName,
          email: user.email,
          profession: profession,
        });

        alert('Profile completed successfully!');
        setShowPopup(false);
        navigate('/home');
      } catch (error) {
        console.log(error);

        setError(error && error?.message);
      }
    } else {
      setError('No user logged in');
    }
  };

  return (
    <div className='flex items-center justify-center w-screen min-h-screen transition-colors duration-200 bg-white dark:bg-black'>
      <div className='w-full max-w-lg p-8 bg-white rounded-lg md:shadow-md md:bg-gray-100 dark:bg-black md:dark:bg-gray-900'>
        <div className='mb-6 space-y-4 '>
          <h2 className='text-2xl font-bold text-center text-gray-900 dark:text-white'>Sign Up</h2>

          {/* <button
            onClick={handleGoogleSignup}
            className='w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600'>
            Sign Up with Google
          </button> */}

          <Button
            onClick={handleGoogleSignup}
            type='button'
            size='lg'
            className='flex items-center justify-center w-full h-12 space-x-2 text-white transition-colors duration-200 rounded-md bg-greenT bg-opacity-70 hover:bg-opacity-50'>
            <FcGoogle size={20} />
            <span>Sign in with Google</span>
          </Button>

          {error && <p className='my-6 text-sm text-red-500 '>{error}</p>}
        </div>
      </div>

      {/* {showPopup && (
        <div className='popup'>
          <h3>Complete Your Profile</h3>
          <div>
            <CustomInput
              label='Profession'
              type='profession'
              id='profession'
              name='profession'
              placeholder='Enter your profession'
              onChange={(e) => setProfession(e.target.value)}
              // error={errors.email}
            />
          </div>

          <button onClick={handleProfileCompletion}>Save</button>
        </div>
      )} */}

      <CustomModal
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onContinue={() => handleProfileCompletion()}
        onChangeInput={(value) => setProfession(value)}
        showCloseButton={false}
        enableScroll={false}
        isloading={false}
        error={error}
      />
    </div>
  );
};

export default Signup;
