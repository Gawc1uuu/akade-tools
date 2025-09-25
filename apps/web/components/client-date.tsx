'use client';

import { useState, useEffect } from 'react';

interface ClientDateProps {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
}

export function ClientDate({ date, options }: ClientDateProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const dateObject = typeof date === 'string' ? new Date(date) : date;

  if (!isClient || !date) {
    return null;
  }

  // Once mounted on the client, render the formatted date
  return <>{dateObject.toLocaleDateString(undefined, options)}</>;
}
