import { useRef, useEffect, useCallback } from "react";

export const useIsMounted = (): (() => boolean) => {
  const mountedRef = useRef(false);
  const isMounted = useCallback(() => mountedRef.current, []);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return isMounted;
};
