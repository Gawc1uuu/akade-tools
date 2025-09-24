import { useEffect, useState } from 'react';

function useDebounce<T>(arg: T, delay: number): T {
  const [value, setValue] = useState<T>(arg);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setValue(arg);
    }, delay);

    return () => clearTimeout(timeout);
  }, [arg, delay]);

  return value;
}

export default useDebounce;
