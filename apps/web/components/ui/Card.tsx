import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
  children: ReactNode;
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, hover = true, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={clsx(
          'bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden',
          className
        )}
        whileHover={hover ? { y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' } : undefined}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('px-6 py-4 border-b border-gray-200', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx('px-6 py-4', className)} {...props} />
));

CardBody.displayName = 'CardBody';

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('px-6 py-4 bg-gray-50 border-t border-gray-200', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';
