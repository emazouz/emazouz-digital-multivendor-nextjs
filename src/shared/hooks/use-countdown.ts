import { useEffect, useState, useCallback } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const useCountdown = (targetDate: string) => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    // Check if window is undefined (SSR)
    if (typeof window === "undefined") {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Only set initial state on mount to avoid hydration mismatch
    // Use setTimeout to avoid synchronous setState warning
    const timeout = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 0);

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, [calculateTimeLeft]);

  return timeLeft;
};
