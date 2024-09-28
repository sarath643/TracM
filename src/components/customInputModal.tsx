import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';
import { CustomRotatingLoader } from './loaders';
import CustomInput from './customInput';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onChangeInput: (profession: string) => void;
  showCloseButton?: boolean;
  enableScroll?: boolean;
  isloading: boolean;
  error: string;
}

const CustomInputModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  showCloseButton = true,
  enableScroll = false,
  onChangeInput,
  isloading,
  error,
}) => {
  const [modalState, setModalState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');

  useEffect(() => {
    if (isOpen && modalState === 'closed') {
      setModalState('opening');
      setTimeout(() => setModalState('open'), 300);
    } else if (!isOpen && modalState === 'open') {
      setModalState('closing');
      setTimeout(() => setModalState('closed'), 300);
    }
  }, [isOpen, modalState]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleContinue = useCallback(() => {
    onContinue();
  }, [onContinue]);

  if (modalState === 'closed') return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-2px ${
          modalState === 'opening' || modalState === 'open'
            ? 'animate-in fade-in-0'
            : 'animate-out fade-out-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-4px)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-2 border-2 border-greenT bg-white dark:bg-black p-6 shadow-lg duration-200 ${
          modalState === 'opening' || modalState === 'open'
            ? 'animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]'
            : 'animate-out fade-out-0 zoom-out-95 slide-out-to-left-1/2 slide-out-to-top-[48%]'
        } sm:rounded-lg ${enableScroll ? 'overflow-y-auto max-h-[80vh]' : ''}`}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-greenT data-[state=open]:text-muted-foreground'>
            <X className='w-4 h-4' />
            <span className='sr-only'>Close</span>
          </button>
        )}
        <div className='space-y-2'>
          <p className='text-lg font-semibold'>Enter your profession for easy data analysis</p>
          <div>
            <CustomInput
              type='email'
              id='email'
              name='email'
              placeholder='Enter Your Profession'
              onChange={(e) => onChangeInput(e.target.value)}
              error={error}
            />
          </div>
        </div>
        <div className='flex gap-2 sm:flex-row sm:justify-end sm:space-x-2'>
          <Button
            onClick={handleContinue}
            type='submit'
            variant='accent'
            size='lg'
            className='relative w-full h-10 text-white sm:w-fit'>
            Continue
            {isloading && (
              <CustomRotatingLoader className={'left-[calc(65%-16px)] sm:left-auto   right-0'} />
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default CustomInputModal;
