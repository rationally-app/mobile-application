import { useState, useEffect, useCallback } from "react";

export const useCountdown = (): {
  secondsLeft: number | undefined;
  startCountdown: (seconds: number) => void;
} => {
  const [secondsLeft, setSecondsLeft] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (secondsLeft === undefined || secondsLeft <= 0) {
      return;
    }
    const timeout = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [secondsLeft]);

  const startCountdown = useCallback((seconds: number) => {
    setSecondsLeft(Math.max(0, seconds));
  }, []);

  return {
    secondsLeft,
    startCountdown
  };
};
