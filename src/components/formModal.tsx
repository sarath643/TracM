import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Button } from './button';
import { X } from 'lucide-react';
import { useIncomeExpenseStore } from '@/store/dataStore';
import CustomInput from './customInput';
import Select from './select';
import { validateEntryFields } from '@/utils/validation';
import CustomToast from './customToast';
import { CustomRotatingLoader } from './loaders';

interface FormModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type EntryType = 'income' | 'expense';

interface Entry {
  id: string;
  date: string;
  type: EntryType;
  category: string;
  amount: number;
}

interface FormErrors {
  date: string;
  type: string;
  category: string;
  amount: string;
}

const incomeTypes = ['Salary', 'Bonus', 'Investment', 'Rental Income', 'Other'];
const expenseTypes = ['Rent', 'Food', 'Travel', 'Cosmetics', 'Bills', 'Other'];

const initialEntry: Omit<Entry, 'id'> = {
  date: '',
  type: 'income',
  category: '',
  amount: 0,
};

const initialErrors: FormErrors = {
  date: '',
  type: '',
  category: '',
  amount: '',
};

const FormModal: React.FC<FormModalProps> = ({ isOpen, setIsOpen }) => {
  const { addEntry } = useIncomeExpenseStore();

  const [newEntry, setNewEntry] = useState<Omit<Entry, 'id'>>(initialEntry as Omit<Entry, 'id'>);

  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [apiError, setApiError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function closeModal() {
    setIsOpen(false);
    setIsLoading(false);
    setNewEntry(initialEntry);
    setErrors(initialErrors);
  }

  const handleChange = (name: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors: FormErrors = {
      date: '',
      type: '',
      category: '',
      amount: '',
    };

    Object.entries(newEntry).forEach(([key, value]) => {
      const error = validateEntryFields(key, value);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== '');

    if (hasErrors) {
      setIsLoading(false);
      return;
    } else {
      console.log('newEntry', newEntry);

      const res = await addEntry({ ...newEntry, amount: newEntry.amount });
      if (res.status == 200) {
        setApiError('');
        CustomToast('Entry added successfully!', 'success');
        closeModal();
      } else {
        setApiError(res.error ?? 'An unknown error occurred');
      }
    }
  };

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
            className='w-[calc(100%-4px)] relative bg-white dark:bg-black p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 z-50 grid  max-w-lg  gap-2 border-2 border-greenT shadow-lg   sm:rounded-lg'>
            <div className='absolute top-0 right-0'>
              <button
                autoFocus={false}
                className='inline-block p-2 text-sm font-medium transition-all duration-300 border-none rounded-md text-black/50 dark:text-white/50 hover:border-transparent focus:ring-0 shrink-0 focus:outline-none'
                onClick={closeModal}>
                <X className='w-5 h-5 ' />
              </button>
            </div>

            <DialogTitle
              as='h3'
              className='text-lg font-medium leading-6 text-gray-900 dark:text-white'>
              Add New Entry
            </DialogTitle>

            <form onSubmit={handleSubmit} className='mt-2 space-y-1'>
              <div>
                <CustomInput
                  label='Date'
                  type='date'
                  id='date'
                  name='date'
                  value={newEntry.date}
                  onChange={(e) => {
                    setNewEntry({ ...newEntry, date: e.target.value });
                    console.log('date', e.target.value);

                    handleChange('date');
                  }}
                  error={errors.date}
                />
              </div>

              <div className=''>
                <Select
                  className='w-full'
                  label='Type'
                  id='type'
                  value={{ id: newEntry.type, label: newEntry.type }}
                  onChange={(value) => {
                    setNewEntry({ ...newEntry, type: value.label as EntryType, category: '' });
                    handleChange('type');
                  }}
                  options={[
                    { id: 'income', label: 'income' },
                    { id: 'expense', label: 'expense' },
                  ]}
                />
                <div className='h-5 '>
                  {errors.type && (
                    <p className='mt-1 ml-1 text-sm text-red-500 dark:text-red-500 '>
                      {errors.type}
                    </p>
                  )}
                </div>
              </div>
              <div className=''>
                <Select
                  className='w-full'
                  label='Category'
                  id='category'
                  value={{ id: newEntry.category, label: newEntry.category }}
                  onChange={(value) => {
                    setNewEntry({ ...newEntry, category: value.label });
                    handleChange('category');
                  }}
                  options={
                    newEntry.type === 'income'
                      ? incomeTypes.map((type) => ({ id: type, label: type }))
                      : expenseTypes.map((type) => ({ id: type, label: type }))
                  }
                />
                <div className='h-5 '>
                  {errors.category && (
                    <p className='mt-1 ml-1 text-sm text-red-500 dark:text-red-500 '>
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <CustomInput
                  label='Amount'
                  type='number'
                  id='amount'
                  name='amount'
                  value={newEntry.amount}
                  onChange={(e) => {
                    setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) });
                    handleChange('amount');
                  }}
                  error={errors.amount}
                />
              </div>

              <div className='ml-1'>
                <p className='text-sm text-red-500 dark:text-red-500 '>{apiError}</p>
              </div>

              <div className='flex flex-col-reverse justify-end gap-2 pt-2 sm:flex-row sm:justify-end '>
                <Button type='button' variant={'cancel'} onClick={closeModal}>
                  Cancel
                </Button>
                <Button type='submit' variant={'accent'} className='relative px-8'>
                  Add
                  {isLoading && (
                    <CustomRotatingLoader
                      className={'left-[calc(60%-20px)] sm:left-auto md:right-2'}
                    />
                  )}
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default FormModal;
