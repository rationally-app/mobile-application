import { useRef, useEffect } from "react";

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  // Refers to the previous value since useEffect will update
  // after this value has already been returned.
  return ref.current;
}
