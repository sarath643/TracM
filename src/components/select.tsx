import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

interface IOption {
  id: number | string;
  label: string;
}

interface ISelectProps {
  id?: string;
  value: IOption;
  options: IOption[];
  onChange: (value: IOption) => void;
  label?: string;
  className?: string;
}

export default function Select({ value, options, onChange, label, id, className }: ISelectProps) {
  return (
    <div>
      <label htmlFor={id} className='text-sm font-medium leading-8 text-blackT dark:text-white'>
        {label}
      </label>

      <Listbox value={value} onChange={onChange}>
        <ListboxButton
          className={clsx(
            'relative block h-10 sm:h-12 dark:border-gray-700  dark:border rounded-lg capitalize bg-gray-200  dark:bg-gray-900  py-1.5 pr-8 pl-3 text-left text-sm/6 text-blackT dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-greenT data-[focus]:ring-2 data-[focus]:ring-greenT data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
            className
          )}>
          {value.label}
          <ChevronDownIcon
            className='group pointer-events-none absolute top-2.5 sm:top-3.5 right-2.5 size-4 dark:fill-white/60'
            aria-hidden='true'
          />
        </ListboxButton>
        <ListboxOptions
          anchor='bottom'
          transition
          className={clsx(
            'w-[var(--button-width)]  rounded-md border border-white/5 bg-gray-100  dark:bg-gray-900  p-1 mt-2 [--anchor-gap:var(--spacing-1)] focus:outline-none focus:ring-2 focus:ring-greenT',
            'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
          )}>
          {options.map((item) => (
            <ListboxOption
              key={item.label}
              value={item}
              className='group flex h-10 sm:h-12 cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-gray-300 dark:data-[focus]:bg-white/10'>
              <CheckIcon className='invisible size-4 fill-black dark:fill-white group-data-[selected]:visible' />
              <div className='text-black capitalize dark:text-white text-sm/6'>{item.label}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
