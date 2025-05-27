"use client";

import { useEffect, useMemo, useState } from "react";

interface useProgressSwitchProps {
  duration: number;
  textList: string[];
}

export const useProgressSwitch = ({
  duration,
  textList,
}: useProgressSwitchProps) => {
  const [progress, setProgress] = useState(0);

  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const text = useMemo(() => textList[index], [textList, index]);

  const showNext = () => {
    if (!textList) return;
    setIsVisible(false);
    setTimeout(() => {
      setIndex((index + 1) % textList.length);
      setIsVisible(true);
    }, 500); // matches fade-out duration
  };

  useEffect(() => {
    if (textList.length === 1) {
      setIndex(0);
      setProgress(0);
      return;
    }

    const step = 1;
    const intervalTime = duration / 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setProgress(0);
          showNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [duration, textList]);

  return {
    progress,
    text,
    isVisible,
  };
};
