import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, t = 400): T {
  const [debouncedValue, setDebouncedValues] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValues(value);
    }, t);

    return () => {
      clearTimeout(timer);
    };
  }, [value, t]);

  return debouncedValue;
}
