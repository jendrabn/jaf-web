import { useEffect, useMemo, useRef, useState } from "react";
import "./index.scss";

export interface CountdownBlocksProps {
  targetDate?: string | Date | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  onExpire?: () => void;
}

interface CountdownState {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const initialState: CountdownState = {
  totalMs: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const pad = (value: number) => value.toString().padStart(2, "0");

const CountdownBlocks = ({
  targetDate,
  className,
  size = "md",
  showLabels = false,
  onExpire,
}: CountdownBlocksProps) => {
  const [timeLeft, setTimeLeft] = useState<CountdownState>(initialState);
  const expireCalledRef = useRef(false);

  useEffect(() => {
    if (!targetDate) return;

    expireCalledRef.current = false;
    const target =
      typeof targetDate === "string" ? new Date(targetDate) : targetDate;

    const calculate = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft(initialState);
        if (!expireCalledRef.current && typeof onExpire === "function") {
          expireCalledRef.current = true;
          onExpire();
        }
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({
        totalMs: diff,
        days,
        hours,
        minutes,
        seconds,
      });
    };

    calculate();
    const interval = window.setInterval(calculate, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [targetDate, onExpire]);

  const segments = useMemo(() => {
    const totalHours = timeLeft.days * 24 + timeLeft.hours;
    return [
      { label: "Jam", value: pad(totalHours) },
      { label: "Menit", value: pad(timeLeft.minutes) },
      { label: "Detik", value: pad(timeLeft.seconds) },
    ];
  }, [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]);

  if (!targetDate) return null;

  return (
    <div className={`countdown-blocks countdown-${size} ${className ?? ""}`}>
      {segments.map((segment) => (
        <div className="countdown-block" key={segment.label}>
          <span className="countdown-value">{segment.value}</span>
          {showLabels && (
            <span className="countdown-label">{segment.label}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CountdownBlocks;
