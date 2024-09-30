import React, { useState, useMemo, useEffect } from 'react';

import { MoveUp, MoveDown, Trash2, Plus, Minus, ChevronsUpDown, Info } from 'lucide-react';
import VerifyModal from '@/components/verifyModal';
import { Button } from '@/components/button';
import { CustomCheckbox } from '@/components/checkbox';
import Select from '@/components/select';
import FormModal from '@/components/formModal';
import { useIncomeExpenseStore } from '@/store/dataStore';
import { auth, db } from '@/firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import CustomToast from '@/components/customToast';
import SummaryCards from './summaryCards';
import { RingButton } from '@/components/movingBorder';
import { useNavigate } from 'react-router-dom';

type EntryType = 'income' | 'expense';
type Period = 'day' | 'week' | 'month' | 'year';
export type TimeFilter = { id: number; label: Period };
type SortField = 'category' | 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

export interface Entry {
  id: string;
  date: string;
  type: EntryType;
  category: string;
  amount: number;
}

const fetchEntries = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      const q = query(collection(db, 'users', user.uid, 'income-expense'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedEntries: Entry[] = [];
      querySnapshot.forEach((doc) => {
        fetchedEntries.push({ id: doc.id, ...doc.data() } as Entry);
      });
      return fetchedEntries;
    } catch (e) {
      console.error('Error fetching entries: ', e);
      return [];
    }
  }
};

const Dashboard: React.FC = () => {
  const { entries: entryData, setEntries: setEntryData, deleteEntry } = useIncomeExpenseStore();

  const [entries, setEntries] = useState<Entry[]>([]);
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>({ id: 3, label: 'month' });
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchEntries();
      if (res) {
        console.log('Fetched entries:', res);
        setEntryData(res as Entry[]);
      }
    };
    fetchData();
  }, [setEntryData]);

  useEffect(() => {
    setEntries(entryData);
    return () => {};
  }, [entryData]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const entryDate = new Date(entry?.date);
      const now = new Date();
      switch (timeFilter.label) {
        case 'day':
          return entryDate.toDateString() === now.toDateString();
        case 'week': {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return entryDate >= weekAgo;
        }
        case 'month':
          return (
            entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear()
          );
        case 'year':
          return entryDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [entries, timeFilter]);

  const filteredAndSortedEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        if (!showIncome && entry?.type === 'income') return false;
        if (!showExpense && entry?.type === 'expense') return false;

        const entryDate = new Date(entry?.date);
        const now = new Date();
        switch (timeFilter.label) {
          case 'day':
            return entryDate.toDateString() === now.toDateString();
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return entryDate >= weekAgo;
          }
          case 'month':
            return (
              entryDate.getMonth() === now.getMonth() &&
              entryDate.getFullYear() === now.getFullYear()
            );
          case 'year':
            return entryDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      })
      .sort((a, b) => {
        if (sortField === 'date') {
          return sortDirection === 'asc'
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortField === 'amount') {
          return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        }
        return sortDirection === 'asc'
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      });
  }, [entries, showIncome, showExpense, timeFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (id: string) => {
    setDeleteEntryId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteEntryId) {
      const res = await deleteEntry(deleteEntryId);
      if (res.status == 200) {
        CustomToast('Deleted successfully!', 'success');
        setDeleteModalOpen(false);
      } else {
        CustomToast(res.error ?? 'An unknown error occurred', 'error');
      }
    }
  };

  const handleGenerateReport = () => {
    if (entryData.length >= 5) {
      navigate('/report');
    } else {
      CustomToast('Please add atleast 5 entries to generate report', 'error');
    }
  };

  return (
    <div className='relative flex w-screen min-h-screen pt-16 pb-10 sm:pt-24'>
      <div className='w-full mx-auto space-y-4 transition-colors duration-200 bg-white max-w-7xl dark:bg-black '>
        <div className='p-4 text-gray-900 dark:text-white'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <SummaryCards
              transactions={filteredEntries}
              filter={timeFilter.label}
              className='col-span-1 md:col-span-2'
            />

            <div className='flex flex-col items-end justify-center w-full col-span-1 mt-4 md:justify-end'>
              <div>
                <RingButton
                  onClick={handleGenerateReport}
                  borderRadius='1rem'
                  className='h-12 text-black bg-white dark:bg-slate-900 dark:text-white border-neutral-200 dark:border-slate-800'>
                  Generate AI Report
                </RingButton>
                {entryData && entryData.length <= 4 && (
                  <p className='flex items-center justify-center w-full gap-1 text-center text-xxxs'>
                    <Info className='w-2 h-2' />
                    Atleast need 5 entries
                  </p>
                )}
              </div>
            </div>
          </div>

          <h1 className='my-5 text-xl font-bold sm:text-2xl'>Income and Expense Overview </h1>

          {entryData && entryData.length > 0 ? (
            <>
              <div className='mb-4 space-y-2'>
                <div className='flex mb-4 space-x-4'>
                  <CustomCheckbox label='Income' enabled={showIncome} setEnabled={setShowIncome} />
                  <CustomCheckbox
                    label='Expense'
                    enabled={showExpense}
                    setEnabled={setShowExpense}
                  />
                </div>

                <div className='flex items-center justify-between space-x-2'>
                  <Select
                    className='w-48 sm:w-52'
                    value={timeFilter}
                    options={[
                      { id: 1, label: 'day' },
                      { id: 2, label: 'week' },
                      { id: 3, label: 'month' },
                      { id: 4, label: 'year' },
                    ]}
                    onChange={(value) => setTimeFilter(value as TimeFilter)}
                  />

                  <div className='flex items-center justify-end'>
                    <Button variant={'accent'} type='button' onClick={() => setAddModalOpen(true)}>
                      <Plus className='w-4 h-4 mr-1' />
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className='overflow-x-auto bg-white border-2 rounded-lg dark:bg-gray-900 border-greenT'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-gray-200 dark:border-gray-700'>
                      <th className='px-4 py-3 text-left'>
                        <button
                          onClick={() => window?.innerWidth <= 640 && handleSort('date')}
                          className='flex items-center space-x-1 font-black'>
                          <span className='hidden sm:block'>Category</span>
                          <span className='text-left sm:hidden'>Category & Date</span>
                          <span className='w-4'>
                            {window?.innerWidth <= 640 && sortField === 'date' ? (
                              sortDirection === 'asc' ? (
                                <MoveDown className='w-4 h-4' />
                              ) : (
                                <MoveUp className='w-4 h-4' />
                              )
                            ) : (
                              <ChevronsUpDown className='w-4 h-4' />
                            )}
                          </span>
                        </button>
                      </th>
                      <th className='hidden px-4 py-3 text-left sm:table-cell'>
                        <div className='flex items-center justify-center '>
                          <button
                            onClick={() => handleSort('date')}
                            className='flex items-center space-x-1 font-black '>
                            <span>Date</span>
                            <span className='w-2'>
                              {sortField === 'date' &&
                                (sortDirection === 'asc' ? (
                                  <MoveUp className='w-4 h-4' />
                                ) : (
                                  <MoveDown className='w-4 h-4' />
                                ))}
                            </span>
                          </button>
                        </div>
                      </th>
                      <th className='px-4 py-3 text-right'>
                        <div className='flex items-center justify-end space-x-1 sm:justify-center'>
                          <button
                            onClick={() => handleSort('amount')}
                            className='flex items-center space-x-1 font-black'>
                            <span>Amount</span>
                            <span className='w-4'>
                              {sortField === 'amount' ? (
                                sortDirection === 'asc' ? (
                                  <MoveUp className='w-4 h-4' />
                                ) : (
                                  <MoveDown className='w-4 h-4' />
                                )
                              ) : (
                                <ChevronsUpDown className='w-4 h-4' />
                              )}
                            </span>
                          </button>
                        </div>
                      </th>
                      <th className='w-10 px-2 py-2 sm:w-20'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedEntries.length > 0 ? (
                      filteredAndSortedEntries.map((entry) => (
                        <tr
                          key={entry?.id}
                          className='border-b border-gray-200 dark:border-gray-700'>
                          <td className='px-4 py-4'>
                            <div className='font-medium'>{entry?.category}</div>
                            <div className='text-sm text-gray-500 dark:text-gray-400 sm:hidden'>
                              {entry?.date}
                            </div>
                          </td>
                          <td className='hidden px-4 py-2 sm:table-cell'>
                            <div className='flex items-center justify-center space-x-1'>
                              {entry?.date}
                            </div>
                          </td>
                          <td
                            className={`px-4 py-4 text-right ${
                              entry?.type === 'income'
                                ? 'text-green-700 dark:text-green-600'
                                : 'text-red-700 dark:text-red-600'
                            }`}>
                            <div className='flex items-center justify-end space-x-1 sm:justify-center'>
                              {entry?.type === 'income' ? (
                                <Plus className='w-4 h-4' />
                              ) : (
                                <Minus className='w-4 h-4' />
                              )}
                              <span>
                                ₹
                                {typeof entry?.amount === 'number'
                                  ? entry.amount.toFixed(2)
                                  : entry?.amount}
                              </span>
                            </div>
                          </td>
                          <td className='w-10 px-2 py-4'>
                            <button
                              onClick={() => handleDelete(entry?.id)}
                              className='text-gray-500 hover:text-red-600'>
                              <Trash2 className='w-4 h-4 sm:w-5 sm:h-5' />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className='py-20 text-center'>
                          <p className='text-gray-500 dark:text-gray-400'>No entries to display</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center h-96'>
              <p className='text-lg text-gray-500 dark:text-gray-400'>No entries to display</p>
              <div className='flex items-center justify-center mt-5 sm:mt-10'>
                <Button variant={'accent'} type='button' onClick={() => setAddModalOpen(true)}>
                  <Plus className='w-4 h-4 mr-1' />
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>

        <VerifyModal
          isOpen={deleteModalOpen}
          setIsOpen={setDeleteModalOpen}
          handleConfirm={confirmDelete}
        />

        <FormModal isOpen={addModalOpen} setIsOpen={setAddModalOpen} />
      </div>
    </div>
  );
};

export default Dashboard;
