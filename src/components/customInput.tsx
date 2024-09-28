import React, { useState } from 'react';
import { useMotionTemplate, useMotionValue, motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface CustomInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  id: string;
  name: string;
  value?: string | number;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type, label, required, ...props }, ref) => {
    const radius = 100; // change this to increase the rdaius of the hover effect
    const [visible, setVisible] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
      const { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    const getCSSVariableValue = (variable: string) => {
      return getComputedStyle(document.documentElement).getPropertyValue(variable);
    };

    const accentColor = getCSSVariableValue('--accent');

    return (
      <div className='flex flex-col w-full'>
        <label htmlFor={props.id} className='text-sm font-medium text-blackT dark:text-white'>
          {label}
          {required && <span className='text-red-500 dark:text-red-500'>*</span>}
        </label>

        <div className='relative mt-1 sm:mt-2 group/icon'>
          <motion.div
            style={{
              background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
          ${accentColor},
          transparent 80%
        )`,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            className='p-[2px] rounded-lg transition duration-300 group/input'>
            <input
              type={type}
              className={cn(
                `flex h-10 text-sm w-full dark:border-gray-700 text-blackT  dark:text-white rounded-md dark:border bg-gray-200 dark:bg-blackT  px-3 py-1
                    file:border-0 file:bg-transparent file:text-sm file:font-medium dark:placeholder:text-lightT placeholder:text-blackT/40
                    focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-greenT
                    disabled:cursor-not-allowed disabled:opacity-50 
                    group-hover/input:shadow-none group-hover/input:border-[.2px] transition duration-400`,
                className
              )}
              ref={ref}
              {...props}
            />
          </motion.div>

          <div className='h-5 '>
            {props.error && (
              <p className='ml-1 text-sm text-red-500 dark:text-red-500 '>{props.error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default CustomInput;
