import { ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import clsx from 'clsx';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  icon?: string;
  onRetry?: () => void;
  retryText?: string;
  children?: ReactNode;
  className?: string;
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      title = 'Something went wrong',
      message = 'An unexpected error occurred. Please try again.',
      icon = '😕',
      onRetry,
      retryText = 'Try Again',
      children,
      className,
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={clsx('text-center py-12', className)}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {icon}
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
        
        {onRetry && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="primary" onClick={onRetry}>
              {retryText}
            </Button>
          </motion.div>
        )}
        
        {children}
      </motion.div>
    );
  }
);

ErrorState.displayName = 'ErrorState';

// Preset variants
export const NetworkError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <ErrorState
    title="Network Error"
    message="Unable to connect to the server. Please check your internet connection and try again."
    icon="📡"
    onRetry={onRetry}
    retryText="Retry Connection"
  />
);

export const NotFoundError: React.FC<{ resourceName?: string; redirectPath?: string; redirectText?: string }> = ({
  resourceName = 'resource',
  redirectPath,
  redirectText = 'Go Back',
}) => (
  <ErrorState
    title={`${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} Not Found`}
    message={`The ${resourceName} you're looking for doesn't exist or has been removed.`}
    icon="🔍"
  >
    {redirectPath && (
      <motion.a href={redirectPath} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant="primary">{redirectText}</Button>
      </motion.a>
    )}
  </ErrorState>
);

export const EmptyState: React.FC<{
  title?: string;
  message?: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
}> = ({
  title = 'Nothing here yet',
  message = "It looks like there's nothing to display right now.",
  icon = '📭',
  actionText,
  onAction,
}) => (
  <ErrorState title={title} message={message} icon={icon}>
    {onAction && actionText && (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      </motion.div>
    )}
  </ErrorState>
);

export const UnauthorizedError: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => (
  <ErrorState
    title="Authentication Required"
    message="You need to be logged in to access this resource."
    icon="🔐"
  >
    {onLogin && (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant="primary" onClick={onLogin}>
          Sign In
        </Button>
      </motion.div>
    )}
  </ErrorState>
);
