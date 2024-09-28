import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Button } from './button';
import { X } from 'lucide-react';

interface VerifyModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm: () => void;
}

const VerifyModal: React.FC<VerifyModalProps> = ({ isOpen, setIsOpen, handleConfirm }) => {
  function closeModal() {
    setIsOpen(false);
  }
  return (
    <Dialog
      open={isOpen}
      as='div'
      className='relative z-10 focus:outline-none'
      onClose={closeModal}>
      <DialogBackdrop className='fixed inset-0 bg-black/50 backdrop-blur-2px ' />

      <div className='flex items-center justify-center min-h-full p-4'>
        <div className='fixed inset-0 flex items-center justify-center w-screen'>
          <DialogPanel
            transition
            className='w-[100%-4px] relative bg-white dark:bg-black p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 z-50 grid  max-w-lg  gap-2 border-2 border-greenT shadow-lg   sm:rounded-lg'>
            <div className='absolute top-0 right-0'>
              <button
                autoFocus={false}
                className='inline-block p-2 text-sm font-medium transition-all duration-300 border-none rounded-md text-black/50 dark:text-white/50 hover:border-transparent focus:ring-0 shrink-0 focus:outline-none'
                onClick={closeModal}>
                <X className='w-5 h-5 ' />
              </button>
            </div>

            {/* <CloseButton>Cancel</CloseButton> */}

            <DialogTitle
              as='h3'
              className='text-lg font-medium leading-6 text-gray-900 dark:text-white'>
              Confirm Deletion
            </DialogTitle>
            <div className='mt-2'>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>
            </div>

            <div className='flex flex-col-reverse justify-end gap-2 mt-4 sm:flex-row sm:justify-end '>
              <Button
                type='button'
                variant={'cancel'}
                // className='inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
                onClick={closeModal}>
                Cancel
              </Button>
              <Button
                type='button'
                variant={'accent'}
                // className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500'
                onClick={handleConfirm}>
                Delete
              </Button>
            </div>
            {/* </div> */}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default VerifyModal;
