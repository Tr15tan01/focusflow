// components/focus-timer.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FOCUS_MESSAGES = [
  "Stay focused, you're doing great!",
  "Deep work leads to great results.",
  "One task at a time, you've got this!",
  "Your focus is your superpower.",
  "Quality over quantity. Stay present.",
  "This time is for your important work.",
  "Distractions can wait. You're in the zone.",
  "Every minute of focus brings you closer to your goals.",
  "Concentrate on what truly matters right now.",
  "Be present with your work, nothing else exists.",
  "This focused time is an investment in your future.",
  "Embrace the challenge of deep concentration.",
  "Your attention is valuable - protect it fiercely.",
  "Let go of distractions and immerse yourself.",
  "This moment is for progress, not perfection.",
  "Trust the process of focused work.",
];

interface FocusTimerProps {
  onTimerStart: () => void;
  onTimerReset: () => void;
}

export const FocusTimer = ({ onTimerStart, onTimerReset }: FocusTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [state, setState] = useState<
    "idle" | "running" | "paused" | "completed"
  >("idle");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(FOCUS_MESSAGES[0]);
  const [showTimer, setShowTimer] = useState(false);

  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const beepSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(0); // Fixed: Added this missing ref

  // Initialize audio elements
  useEffect(() => {
    // Create audio elements without source to avoid hydration issues
    beepSoundRef.current = new Audio();
    clickSoundRef.current = new Audio();

    // Set sources after component mounts (client-side only)
    if (typeof window !== "undefined") {
      beepSoundRef.current.src = "/media/beep.mp3";
      clickSoundRef.current.src = "/media/click.mp3";
    }

    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Handle tab visibility changes to keep timer accurate
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && state === "running") {
        // Tab is hidden, store the current time
        lastUpdateTimeRef.current = Date.now();
      } else if (!document.hidden && state === "running") {
        // Tab is visible again, calculate time passed
        const timePassed = Math.floor(
          (Date.now() - lastUpdateTimeRef.current) / 1000
        );
        if (timePassed > 0) {
          setTimeLeft((prev) => {
            const newTime = Math.max(0, prev - timePassed);
            if (newTime === 0) {
              setState("completed");
              playBeepSound();
              return 0;
            }
            return newTime;
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [state]);

  // Play click sound
  const playClickSound = useCallback(() => {
    if (soundEnabled && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  }, [soundEnabled]);

  // Play beep sound
  const playBeepSound = useCallback(() => {
    if (soundEnabled && beepSoundRef.current) {
      beepSoundRef.current.currentTime = 0;
      beepSoundRef.current.play().catch(() => {});
    }
  }, [soundEnabled]);

  // Calculate progress percentage for the circle
  const progress = initialTime > 0 ? (1 - timeLeft / initialTime) * 100 : 0;

  // Format time for display
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Start the timer
  const startTimer = useCallback(() => {
    const totalSeconds = hours * 3600 + minutes * 60;
    if (totalSeconds <= 0) return;

    playClickSound();
    setInitialTime(totalSeconds);
    setTimeLeft(totalSeconds);
    setState("running");
    onTimerStart();
    lastUpdateTimeRef.current = Date.now();

    // Clear any existing interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Start new interval
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerIntervalRef.current as NodeJS.Timeout);
          setState("completed");
          playBeepSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start message rotation every 3 minutes (180 seconds)
    if (messageIntervalRef.current) {
      clearInterval(messageIntervalRef.current);
    }

    messageIntervalRef.current = setInterval(() => {
      setCurrentMessage((prev) => {
        const currentIndex = FOCUS_MESSAGES.indexOf(prev);
        const nextIndex = (currentIndex + 1) % FOCUS_MESSAGES.length;
        return FOCUS_MESSAGES[nextIndex];
      });
    }, 180000); // 3 minutes in milliseconds

    // Smooth transition to timer view
    setTimeout(() => setShowTimer(true), 100);
  }, [hours, minutes, playClickSound, onTimerStart, playBeepSound]);

  // Reset the timer
  const resetTimer = useCallback(() => {
    playClickSound();
    setState("idle");
    setTimeLeft(0);
    setInitialTime(0);
    setShowTimer(false);
    onTimerReset();

    // Clear intervals
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (messageIntervalRef.current) {
      clearInterval(messageIntervalRef.current);
      messageIntervalRef.current = null;
    }
  }, [playClickSound, onTimerReset]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    playClickSound();
    setState("paused");

    // Clear the timer interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [playClickSound]);

  // Resume the timer
  const resumeTimer = useCallback(() => {
    playClickSound();
    setState("running");
    lastUpdateTimeRef.current = Date.now();

    // Start the timer interval again
    if (!timerIntervalRef.current) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timerIntervalRef.current as NodeJS.Timeout);
            setState("completed");
            playBeepSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [playClickSound, playBeepSound]);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
    playClickSound();
  }, [playClickSound]);

  // Generate hour options (0-12)
  const hourOptions = Array.from({ length: 13 }, (_, i) => i);

  // Generate minute options (0-59 in 5-minute increments)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 min-h-[70vh]">
      {!showTimer ? (
        // Time selection UI
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-500">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Set Focus Time
          </h3>

          <div className="flex justify-center items-end gap-4 mb-8">
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hours
              </label>
              <select
                value={hours}
                onChange={(e) => {
                  setHours(parseInt(e.target.value));
                  playClickSound();
                }}
                className="w-20 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-xl"
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            <div className="pb-3 text-2xl font-bold">:</div>

            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minutes
              </label>
              <select
                value={minutes}
                onChange={(e) => {
                  setMinutes(parseInt(e.target.value));
                  playClickSound();
                }}
                className="w-20 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-xl"
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={startTimer}
            disabled={hours === 0 && minutes === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg transition-all"
          >
            <Play className="mr-2 h-5 w-5" />
            Start Focus Session
          </Button>
        </div>
      ) : (
        // Timer display UI
        <div className="w-full flex flex-col items-center justify-center transition-all duration-500">
          {/* Timer display */}
          <div className="relative w-80 h-80 md:w-96 md:h-96 mb-8">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className={cn(
                  "transition-all duration-1000 ease-linear",
                  state === "completed"
                    ? "text-red-500 animate-pulse"
                    : "text-purple-600"
                )}
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              />
            </svg>

            {/* Timer text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className={cn(
                  "text-4xl md:text-5xl font-mono font-bold",
                  state === "completed"
                    ? "text-red-600 animate-pulse"
                    : "text-purple-700"
                )}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm mt-2 text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Focus Time
              </div>
              {state === "completed" && (
                <div className="text-lg font-semibold mt-2 animate-pulse">
                  Time is up!
                </div>
              )}
            </div>
          </div>

          {/* Motivational message */}
          <div className="text-center max-w-md mb-8 px-4">
            <p className="text-lg text-gray-700 dark:text-gray-300 italic">
              {currentMessage}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 justify-center">
            {state === "running" && (
              <Button
                onClick={pauseTimer}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg"
              >
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </Button>
            )}

            {state === "paused" && (
              <Button
                onClick={resumeTimer}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Resume
              </Button>
            )}

            {(state === "running" || state === "paused") && (
              <Button
                onClick={resetTimer}
                variant="outline"
                className="border-gray-500 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-full text-lg font-semibold"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
            )}

            {state === "completed" && (
              <Button
                onClick={resetTimer}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Start New Session
              </Button>
            )}

            <Button
              onClick={toggleSound}
              variant="ghost"
              size="icon"
              className="rounded-full w-12 h-12"
            >
              {soundEnabled ? (
                <Volume2 className="h-6 w-6" />
              ) : (
                <VolumeX className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
