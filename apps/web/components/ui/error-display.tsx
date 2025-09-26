import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { cn } from '~/lib/utils';

interface ErrorDisplayProps {
  messages: string[];
  className?: string;
}

export const ErrorDisplay = ({ messages, className }: ErrorDisplayProps) => {
  if (!messages || messages.length === 0) {
    return null;
  }

  const formattedMessages = messages.join(', ');

  return (
    <Alert variant="destructive" className={cn('border-red-200 bg-red-50 text-red-800', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-sm font-medium">{formattedMessages}</AlertDescription>
    </Alert>
  );
};