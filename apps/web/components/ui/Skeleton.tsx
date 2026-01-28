import { HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width, height, circle = false, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'animate-pulse bg-gray-200',
          circle ? 'rounded-full' : 'rounded-md',
          className
        )}
        style={{
          width: width || '100%',
          height: height || '1rem',
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
