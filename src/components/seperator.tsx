import * as React from 'react';

interface SeperatorProps extends React.HTMLProps<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

const Seperator = React.forwardRef<HTMLDivElement, SeperatorProps>((props, ref) => {
  const { orientation = 'horizontal', className, ...rest } = props;

  return (
    <div
      ref={ref}
      className={`flex items-center ${
        orientation === 'horizontal' ? 'w-full' : 'h-full'
      } ${className}`}
      {...rest}>
      <div
        className={`${
          orientation === 'horizontal' ? 'flex-1 h-[1px] bg-gray-400' : 'w-[1px] h-full bg-gray-400'
        }`}></div>
      <div className='mx-2 text-gray-500 dark:text-white'>{props.children}</div>
      <div
        className={`${
          orientation === 'horizontal' ? 'flex-1 h-[1px] bg-gray-400' : 'w-[1px] h-full bg-gray-400'
        }`}></div>
    </div>
  );
});

export default Seperator;
