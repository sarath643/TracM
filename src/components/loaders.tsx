import React from 'react';
import { cn } from '../utils/cn';

interface CustomLoaderProps {
  numberOfDots?: number;
  className?: string;
}

export const CustomDotLoader: React.FC<CustomLoaderProps> = ({ numberOfDots, className }) => {
  return (
    <div className={cn(`flex space-x-2`)}>
      {Array.from({ length: numberOfDots ?? 3 }, (_, i) => (
        <div
          key={i}
          className={cn(className, `bg-greeT/80 animate-ping  md:w-1.5 md:h-1.5 rounded-full`)}
          style={{ animationDelay: `${i * 100}ms` }}></div>
      ))}
    </div>
  );
};

export const CustomRotatingLoader: React.FC<CustomLoaderProps> = ({ className }) => {
  return (
    <div className={cn(className, `absolute z-20 flex right-2`)}>
      <div
        className='inline-block h-5 w-5 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] text-skin-text  motion-reduce:animate-[spin_1.5s_linear_infinite]'
        role='status'></div>
    </div>
  );
};
