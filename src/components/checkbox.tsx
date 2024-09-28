import { Checkbox, Field, Label } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/16/solid';

interface CustomCheckboxProps {
  label?: string;
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CustomCheckbox({ enabled, setEnabled, label }: CustomCheckboxProps) {
  return (
    <Field className='flex items-center gap-2'>
      <Checkbox
        checked={enabled}
        onChange={setEnabled}
        className='group size-6 rounded-md dark:bg-gray-900 bg-gray-200  p-1 ring-1 ring-white/15 ring-inset data-[checked]:bg-white dark:data-[checked]:bg-white'>
        <CheckIcon className='hidden size-4 fill-black group-data-[checked]:block' />
      </Checkbox>
      <Label className={'text-sm'}>{label}</Label>
    </Field>
  );
}
