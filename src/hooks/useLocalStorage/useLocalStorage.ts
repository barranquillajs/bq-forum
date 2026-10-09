import { useEffect, useState } from 'react';

export const useLocalStorage = <T>(key: string) => {
  const [value, setValue] = useState<T | null>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  });

  useEffect(() => {
    const update = () => {
      const item = localStorage.getItem(key);
      setValue(item ? JSON.parse(item) : null);
    };

    window.addEventListener('storage', update);
    window.addEventListener(`local-storage:${key}`, update);

    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener(`local-storage:${key}`, update);
    };
  }, [key]);

  return value;
};
