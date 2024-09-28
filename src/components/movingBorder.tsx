import React from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';

export function RingButton({
  borderRadius = '1.75rem',
  children,
  as: Component = 'button',
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <Component
      className={`
        bg-transparent relative text-xl  h-12 w-60 p-[1.5px] overflow-hidden ${containerClassName} 
        
      `}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}>
      <div className='absolute inset-0' style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}>
        <MovingBorder duration={duration} rx='30%' ry='30%'>
          <div
            className={`
              h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--green-500)_40%,transparent_60%)] ${borderClassName}
            `}
          />
        </MovingBorder>
      </div>

      <div
        className={`
          'relative  dark:bg-[linear-gradient(110deg,#000103,45%,#50c060,55%,#000103)] bg-[linear-gradient(110deg,#e5e7eb,45%,#50c060,55%,#e5e7eb)] bg-[length:200%_100%] px-6 font-medium transition-colors 
          focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 border dark:border-slate-800 border-slate-300
          backdrop-blur-xl text-black dark:text-white flex items-center justify-center w-full h-full text-sm antialiased animate-shimmer
            ${className}
        `}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}>
        {children}
      </div>
    </Component>
  );
}

interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
}

export const MovingBorder = ({
  children,
  duration = 3500,
  rx,
  ry,
  ...otherProps
}: MovingBorderProps & React.SVGProps<SVGSVGElement>) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y);

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        preserveAspectRatio='none'
        className='absolute w-full h-full'
        width='100%'
        height='100%'
        {...otherProps}>
        <rect fill='none' width='100%' height='100%' rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'inline-block',
          transform,
        }}>
        {children}
      </motion.div>
    </>
  );
};
