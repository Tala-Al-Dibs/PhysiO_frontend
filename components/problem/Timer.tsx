import React, { useEffect, useRef, useState } from "react";
import { Text } from "react-native";

interface TimerProps {
  initialTime: number;
  onTimerEnd: () => void;
  isPaused: boolean;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimerEnd, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());

  const updateTimer = () => {
    if (!isPaused) {
      const now = Date.now();
      const delta = now - lastUpdateTimeRef.current;

      if (delta >= 1000) {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            onTimerEnd();
          }
          return newTime;
        });
        lastUpdateTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }
  };

  useEffect(() => {
    if (!isPaused) {
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, onTimerEnd]);

  useEffect(() => {
    setTimeLeft(initialTime); // Reset the timer when initialTime changes
    lastUpdateTimeRef.current = Date.now(); // Reset the last update time
  }, [initialTime]);

  return (
    <Text style={{ fontSize: 48, fontWeight: "bold", position: "absolute" }}>
      {timeLeft} seconds
    </Text>
  );
};

export default React.memo(Timer); // Wrap with React.memo
