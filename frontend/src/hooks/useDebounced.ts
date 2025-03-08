import { useCallback, useRef } from 'react';

const useDebounced = (fn: (...args: any[]) => void, delay: number) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);

  fnRef.current = fn;

  const debounced = useCallback(
    (...args: any[]) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => fn(...args), delay);
    },
    [delay],
  );

  return debounced;
};

export default useDebounced;
