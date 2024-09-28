import React, { useEffect, useState } from 'react';
import CustomModal from './customInputModal';
import { auth, db } from '@/firebase/config';
import { isEmptyValue } from '@/utils/validation';
import { doc, setDoc } from 'firebase/firestore';
import CustomToast from './customToast';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  isComplete: boolean;
}

const Footer: React.FC<FooterProps> = ({ isComplete }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [profession, setProfession] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isloading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isComplete) {
      setShowPopup(true);
    }
  }, [isComplete]);

  const handleProfileCompletion = async () => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (user) {
      let error = '';
      try {
        error = isEmptyValue(profession, 'profession');
        if (error) {
          setError(error);
          setIsLoading(false);
          return;
        }
        await setDoc(doc(db, 'users', user.uid), {
          fullName: user.displayName,
          email: user.email,
          profession: profession,
          isProfileComplete: true,
        });
        CustomToast('Profile created successfully!', 'success');
        setTimeout(() => {
          CustomToast(`Welcome ${user.displayName}!`, 'success');
        }, 2000);
        setShowPopup(false);
        setIsLoading(false);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error updating profile:', error);
        setError((error as Error)?.message);
        setIsLoading(false);
      }
    } else {
      setError('No user logged in');
      setIsLoading(false);
    }
  };

  return (
    <div className='relative'>
      <footer className='flex items-center justify-center w-screen h-10 px-10 bg-gray-100 sm:h-12 sm:justify-end dark:bg-gray-900'>
        <p className='text-xs text-gray-500 sm:text-sm dark:text-gray-400'>
          &copy;
          {new Date().getFullYear()} TracM. All rights reserved.
        </p>
      </footer>

      <CustomModal
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onContinue={() => handleProfileCompletion()}
        onChangeInput={(value) => setProfession(value)}
        showCloseButton={false}
        enableScroll={false}
        isloading={isloading}
        error={error}
      />
    </div>
  );
};

export default Footer;
