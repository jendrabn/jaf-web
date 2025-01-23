import { useState, useEffect } from "react";

function useDebounce(callback: () => void, delay: number) {
  const [debounce, setDebounce] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      callback();
      setDebounce(false);
    }, delay);
    return () => clearTimeout(timeout);
  }, [callback, debounce, delay]);

  return setDebounce;
}
export default useDebounce;
