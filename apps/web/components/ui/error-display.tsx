import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { cn } from '~/lib/utils';


interface ErrorDisplayProps {
  message: string;
  className?: string;
}

export const ErrorDisplay = ({ message, className }: ErrorDisplayProps) => {
  return (
    <Alert variant="destructive" className={cn('border-red-200 bg-red-50 text-red-800', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-sm font-medium">{message}</AlertDescription>
    </Alert>
  );
};
