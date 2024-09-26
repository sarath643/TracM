import { toast } from 'sonner';

const CustomToast = (message: string, mode?: string) => {
  const position = 'top-left';
  if (mode === 'error') {
    toast.error(message, {
      className:
        'bg-skin-text/10 backdrop-blur-sm border-skin-fill/50 text-red-600 flex items-center w-full justify-center md:justify-start',
    });
    return;
  } else if (mode === 'success') {
    toast.success(message, {
      className:
        'bg-white dark:bg-blackT/40 backdrop-blur-sm border-gray-200 dark:border-gray-600 border-[0.2px] text-green-900 dark:text-green-600 flex items-center w-full justify-center md:justify-start',
      position: 'top-right',
    });
    return;
  }
  return;
};

export default CustomToast;
