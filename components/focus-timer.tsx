// components/focus-timer.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Pause,
  Zap,
  Target,
  Clock,
  Sparkles,
  Settings,
  ChevronDown,
  ChevronUp,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/use-audio-player";

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

// Preset time options (in minutes)
const TIME_PRESETS = [
  {
    label: "Quick Focus",
    minutes: 5,
    color: "bg-gradient-to-br from-emerald-500 to-teal-500",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    label: "Focus Sprint",
    minutes: 15,
    color: "bg-gradient-to-br from-blue-500 to-cyan-500",
    icon: <Timer className="h-5 w-5" />,
  },
  {
    label: "Short Session",
    minutes: 25,
    color: "bg-gradient-to-br from-purple-500 to-pink-500",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    label: "Deep Work",
    minutes: 45,
    color: "bg-gradient-to-br from-indigo-500 to-purple-600",
    icon: <Target className="h-5 w-5" />,
  },
  {
    label: "Power Hour",
    minutes: 60,
    color: "bg-gradient-to-br from-pink-500 to-rose-500",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    label: "Custom",
    minutes: 0,
    color: "bg-gradient-to-br from-gray-600 to-gray-400",
    icon: <Settings className="h-5 w-5" />,
  },
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(2); // Default to 25 minutes
  const [customTimeOpen, setCustomTimeOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const lastPauseTimeRef = useRef<number>(0);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { playClick, playBeep } = useAudioPlayer();

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Create worker from Blob
  const createWorker = useCallback(() => {
    const workerCode = `
let timerInterval = null;
let timerStartTime = null;
let timerDuration = 0;

self.onmessage = function(e) {
  const { type, duration, pauseTime } = e.data;
  
  switch (type) {
    case 'start':
      if (timerInterval) clearInterval(timerInterval);
      timerDuration = duration;
      timerStartTime = Date.now();
      
      timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
        const remaining = Math.max(0, timerDuration - elapsed);
        
        self.postMessage({ type: 'tick', remaining, elapsed });
        
        if (remaining <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          self.postMessage({ type: 'completed' });
        }
      }, 1000);
      break;
      
    case 'pause':
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
        const remaining = Math.max(0, timerDuration - elapsed);
        self.postMessage({ type: 'paused', remaining });
      }
      break;
      
    case 'resume':
      if (!timerInterval && timerStartTime && timerDuration > 0) {
        const remaining = timerDuration - Math.floor((pauseTime - timerStartTime) / 1000);
        timerDuration = remaining;
        timerStartTime = Date.now() - (timerDuration - remaining) * 1000;
        
        timerInterval = setInterval(() => {
          const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
          const remaining = Math.max(0, timerDuration - elapsed);
          
          self.postMessage({ type: 'tick', remaining, elapsed });
          
          if (remaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            self.postMessage({ type: 'completed' });
          }
        }, 1000);
      }
      break;
      
    case 'stop':
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      timerStartTime = null;
      timerDuration = 0;
      self.postMessage({ type: 'stopped' });
      break;
  }
};
`;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    return new Worker(URL.createObjectURL(blob));
  }, []);

  // Initialize Web Worker
  useEffect(() => {
    if (isClient) {
      workerRef.current = createWorker();

      if (workerRef.current) {
        workerRef.current.onmessage = (e) => {
          const { type, remaining } = e.data;

          switch (type) {
            case "tick":
              setTimeLeft(remaining);
              updateDocumentTitle(remaining);
              break;
            case "completed":
              setState("completed");
              setTimeLeft(0);
              updateDocumentTitle(0, true);
              playBeep();
              startTitleBlinking();
              break;
            case "paused":
              setTimeLeft(remaining);
              updateDocumentTitle(remaining);
              break;
          }
        };
      }

      // Request notification permission
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      document.title = "FocusFlow";
    };
  }, [isClient, playBeep, createWorker]);

  // Update document title with remaining time
  const updateDocumentTitle = (seconds: number, completed = false) => {
    if (completed) {
      document.title = "⏰ Time's Up! - FocusFlow";
    } else if (seconds > 0) {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      let title = "";
      if (hrs > 0) {
        title = `${hrs}:${mins.toString().padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")} - FocusFlow`;
      } else {
        title = `${mins}:${secs.toString().padStart(2, "0")} - FocusFlow`;
      }
      document.title = title;
    } else {
      document.title = "FocusFlow";
    }
  };

  // Start blinking title when timer completes
  const startTitleBlinking = () => {
    let blink = true;
    const blinkInterval = setInterval(() => {
      document.title = blink ? "⏰ Time's Up! - FocusFlow" : "FocusFlow";
      blink = !blink;
    }, 1000);

    // Stop blinking after 30 seconds
    setTimeout(() => {
      clearInterval(blinkInterval);
      document.title = "FocusFlow";
    }, 30000);
  };

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

  // Smooth transition to timer view
  const startTimerTransition = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowTimer(true);
      setIsTransitioning(false);
    }, 300);
  }, []);

  // Smooth transition away from timer view
  const resetTimerTransition = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowTimer(false);
      setIsTransitioning(false);
    }, 300);
  }, []);

  // Handle preset selection
  const handlePresetSelect = useCallback(
    (index: number) => {
      if (soundEnabled) playClick();

      setSelectedPreset(index);
      const preset = TIME_PRESETS[index];

      if (preset.minutes === 0) {
        // Custom preset selected
        setCustomTimeOpen(true);
        // Don't reset hours/minutes if they're already set
        if (hours === 0 && minutes === 0) {
          setHours(0);
          setMinutes(25);
        }
      } else {
        setCustomTimeOpen(false);
        setHours(Math.floor(preset.minutes / 60));
        setMinutes(preset.minutes % 60);
      }
    },
    [soundEnabled, playClick, hours, minutes]
  );

  // Handle custom time change
  const handleCustomTimeChange = useCallback(
    (type: "hours" | "minutes", value: number) => {
      if (soundEnabled) playClick();

      if (type === "hours") {
        setHours(value);
      } else {
        setMinutes(value);
      }

      // Mark as custom selection
      setSelectedPreset(null);
    },
    [soundEnabled, playClick]
  );

  // Increment/decrement hours
  const incrementHours = useCallback(() => {
    if (soundEnabled) playClick();
    setHours((prev) => Math.min(12, prev + 1));
    setSelectedPreset(null);
  }, [soundEnabled, playClick]);

  const decrementHours = useCallback(() => {
    if (soundEnabled) playClick();
    setHours((prev) => Math.max(0, prev - 1));
    setSelectedPreset(null);
  }, [soundEnabled, playClick]);

  // Increment/decrement minutes
  const incrementMinutes = useCallback(() => {
    if (soundEnabled) playClick();
    setMinutes((prev) => {
      if (prev >= 59) return 0;
      return prev + 1;
    });
    setSelectedPreset(null);
  }, [soundEnabled, playClick]);

  const decrementMinutes = useCallback(() => {
    if (soundEnabled) playClick();
    setMinutes((prev) => {
      if (prev <= 0) return 59;
      return prev - 1;
    });
    setSelectedPreset(null);
  }, [soundEnabled, playClick]);

  // Set minutes directly
  const setMinutesDirectly = useCallback(
    (value: number) => {
      if (soundEnabled) playClick();
      setMinutes(value);
      setSelectedPreset(null);
    },
    [soundEnabled, playClick]
  );

  // Toggle custom time section
  const toggleCustomTime = useCallback(() => {
    if (soundEnabled) playClick();
    setCustomTimeOpen(!customTimeOpen);
    setSelectedPreset(5); // Select the custom preset
  }, [soundEnabled, playClick, customTimeOpen]);

  // Start the timer
  const startTimer = useCallback(() => {
    const totalSeconds = hours * 3600 + minutes * 60;
    if (totalSeconds <= 0) return;

    if (soundEnabled) playClick();
    setInitialTime(totalSeconds);
    setTimeLeft(totalSeconds);
    setState("running");
    onTimerStart();

    // Send start command to worker
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "start",
        duration: totalSeconds,
      });
    }

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
    startTimerTransition();
  }, [
    hours,
    minutes,
    soundEnabled,
    playClick,
    onTimerStart,
    startTimerTransition,
  ]);

  // Reset the timer
  const resetTimer = useCallback(() => {
    if (soundEnabled) playClick();
    setState("idle");
    setTimeLeft(0);
    setInitialTime(0);
    setSelectedPreset(2); // Reset to default preset
    setCustomTimeOpen(false);
    onTimerReset();

    // Send stop command to worker
    if (workerRef.current) {
      workerRef.current.postMessage({ type: "stop" });
    }

    // Clear intervals
    if (messageIntervalRef.current) {
      clearInterval(messageIntervalRef.current);
      messageIntervalRef.current = null;
    }

    // Reset document title
    document.title = "FocusFlow";

    // Smooth transition away from timer view
    resetTimerTransition();
  }, [soundEnabled, playClick, onTimerReset, resetTimerTransition]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (soundEnabled) playClick();
    setState("paused");
    lastPauseTimeRef.current = Date.now();

    // Send pause command to worker
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "pause",
        pauseTime: lastPauseTimeRef.current,
      });
    }
  }, [soundEnabled, playClick]);

  // Resume the timer
  const resumeTimer = useCallback(() => {
    if (soundEnabled) playClick();
    setState("running");

    // Send resume command to worker
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "resume",
        pauseTime: lastPauseTimeRef.current,
      });
    }
  }, [soundEnabled, playClick]);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
    if (!soundEnabled) playClick(); // Only play sound when enabling
  }, [soundEnabled, playClick]);

  // Common minute options for quick selection
  const commonMinutes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 45, 60];

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 min-h-[70vh]">
        <div className="w-full max-w-2xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"
                ></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8"></div>
            <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 min-h-[70vh]">
      {!showTimer ? (
        // Time selection UI with smooth transition
        <div
          className={cn(
            "bg-gradient-to-br from-white via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/10 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-4xl transition-all duration-300 border border-gray-100/50 dark:border-gray-700/50 backdrop-blur-sm",
            isTransitioning
              ? "opacity-0 scale-95 -translate-y-4"
              : "opacity-100 scale-100 translate-y-0"
          )}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-rose-400">
              Ready to Focus?
            </h2>
          </div>

          {/* Preset Selection Grid - Now 6 items */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 mb-8">
            {TIME_PRESETS.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetSelect(index)}
                className={cn(
                  "relative p-4 md:p-5 rounded-2xl flex flex-col items-center justify-center gap-1 md:gap-2 transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 group",
                  selectedPreset === index
                    ? "border-purple-500/80 dark:border-purple-400/80 shadow-xl shadow-purple-200/50 dark:shadow-purple-900/30"
                    : "border-transparent hover:border-gray-200/50 dark:hover:border-gray-600/50",
                  preset.color === "bg-gradient-to-br from-gray-600 to-gray-400"
                    ? "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"
                    : preset.color
                )}
              >
                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />

                {preset.icon && (
                  <div
                    className={cn(
                      "p-2 md:p-3 rounded-full mb-1 md:mb-2 relative z-10",
                      selectedPreset === index
                        ? "bg-white/30 backdrop-blur-sm"
                        : "bg-white/20 backdrop-blur-sm"
                    )}
                  >
                    {preset.icon}
                  </div>
                )}
                <span
                  className={cn(
                    "font-bold text-base md:text-lg relative z-10 text-center",
                    preset.minutes === 0
                      ? "text-gray-800 dark:text-gray-200"
                      : "text-white"
                  )}
                >
                  {preset.minutes === 0 ? "Custom" : `${preset.minutes}m`}
                </span>
                <span
                  className={cn(
                    "text-xs opacity-90 relative z-10 text-center",
                    preset.minutes === 0
                      ? "text-gray-600 dark:text-gray-400"
                      : "text-white/90"
                  )}
                >
                  {preset.label}
                </span>
              </button>
            ))}
          </div>

          {/* Time Display Card */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-gray-50/80 to-purple-50/50 dark:from-gray-800/80 dark:to-purple-900/20 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-inner">
              <div className="flex flex-col items-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {hours > 0 ? `${hours}h ` : ""}
                    {minutes}m
                  </span>
                </div>
                <div className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-4 text-center">
                  Total:{" "}
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {hours * 60 + minutes} minutes
                  </span>
                  {" • "}
                  <span className="text-sm">
                    {hours * 3600 + minutes * 60} seconds
                  </span>
                </div>

                {/* Custom Time Toggle */}
                <button
                  onClick={toggleCustomTime}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500",
                    customTimeOpen
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  {customTimeOpen ? "Hide Settings" : "Custom Time"}
                  {customTimeOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Custom Time Selection - Improved Design */}
          <div
            className={cn(
              "mb-8 transition-all duration-500 ease-in-out overflow-hidden",
              customTimeOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-900/10 p-6 rounded-2xl border border-purple-200/50 dark:border-purple-800/30 backdrop-blur-sm shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white text-center">
                Custom Time Settings
              </h3>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Hours Selection */}
                <div className="flex flex-col items-center w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
                    Hours
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={decrementHours}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 hover:scale-110 active:scale-95 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      -
                    </button>

                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-inner border border-gray-200/50 dark:border-gray-700/50">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {hours}
                          </span>
                        </div>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                        {hours === 1 ? "hour" : "hours"}
                      </div>
                    </div>

                    <button
                      onClick={incrementHours}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 hover:scale-110 active:scale-95 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {[0, 1, 2, 3, 4, 5].map((hour) => (
                      <button
                        key={hour}
                        onClick={() => handleCustomTimeChange("hours", hour)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500",
                          hours === hour
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                      >
                        {hour}h
                      </button>
                    ))}
                  </div>
                </div>

                {/* Separator */}
                <div className="hidden md:block text-2xl font-bold text-gray-400 dark:text-gray-500">
                  :
                </div>

                {/* Minutes Selection */}
                <div className="flex flex-col items-center w-full md:w-auto">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
                    Minutes
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={decrementMinutes}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 hover:scale-110 active:scale-95 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      -
                    </button>

                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-inner border border-gray-200/50 dark:border-gray-700/50">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {minutes}
                          </span>
                        </div>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                        minutes
                      </div>
                    </div>

                    <button
                      onClick={incrementMinutes}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 hover:scale-110 active:scale-95 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      +
                    </button>
                  </div>

                  {/* Quick minute buttons */}
                  <div className="mt-4 w-full">
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
                      Quick select minutes:
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 justify-center max-w-2xl mx-auto">
                      {commonMinutes.map((minute) => (
                        <button
                          key={minute}
                          onClick={() => setMinutesDirectly(minute)}
                          className={cn(
                            "px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500",
                            minutes === minute
                              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          )}
                        >
                          {minute}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Minute input for exact values */}
              <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Set exact minutes (1-59):
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) =>
                        setMinutesDirectly(Number(e.target.value))
                      }
                      className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500"
                    />
                    <div className="w-16 text-center">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {minutes}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">
                        min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={startTimer}
            disabled={hours === 0 && minutes === 0}
            className={cn(
              "w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white py-5 rounded-xl text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
              hours === 0 && minutes === 0 && "opacity-60 cursor-not-allowed"
            )}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            {/* Button content */}
            <div className="relative z-10 flex items-center justify-center gap-3">
              <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                <Play className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-xl">Start Focus Session</span>
            </div>
          </Button>
        </div>
      ) : (
        // Timer display UI with smooth transition
        <div
          className={cn(
            "w-full flex flex-col items-center justify-center transition-all duration-300",
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}
        >
          {/* Timer display with glow effect */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mb-8">
            {/* Glow effect */}
            <div
              className={cn(
                "absolute inset-0 rounded-full blur-3xl transition-all duration-1000",
                state === "completed"
                  ? "bg-gradient-to-br from-red-500/30 to-rose-600/30 animate-pulse"
                  : "bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-rose-500/30"
              )}
            />

            {/* Timer SVG */}
            <div className="relative w-full h-full">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
                style={{ isolation: "isolate" }}
              >
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-200/50 dark:text-gray-700/50 transition-all duration-1000"
                  style={{ paintOrder: "stroke" }}
                />

                {/* Progress circle - Fixed for dark mode */}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className={cn(
                    "transition-all duration-1000 ease-out",
                    state === "completed"
                      ? "text-red-500 dark:text-red-400 animate-pulse"
                      : "text-purple-500 dark:text-purple-400"
                  )}
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 44 * (1 - progress / 100)
                  }`}
                  style={{ paintOrder: "stroke" }}
                />
              </svg>
            </div>

            {/* Timer text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <div
                className={cn(
                  "text-4xl md:text-5xl lg:text-7xl font-mono font-bold transition-all duration-500 text-center",
                  state === "completed"
                    ? "text-red-600 dark:text-red-400 animate-pulse"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400"
                )}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm mt-3 text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-opacity duration-500 font-medium">
                Focus Time
              </div>
              {state === "completed" && (
                <div className="text-lg md:text-xl font-semibold mt-3 animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500 dark:from-red-400 dark:to-rose-400 transition-all duration-500">
                  Time&apos;s up! 🎉
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mb-8 px-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
              <span>Progress</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-3 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500 ease-out",
                  state === "completed"
                    ? "bg-gradient-to-r from-red-500 via-rose-500 to-red-600 dark:from-red-400 dark:via-rose-400 dark:to-red-500"
                    : "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Motivational message */}
          <div className="text-center max-w-md mb-8 px-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-lg rounded-2xl" />
              <p className="relative text-base md:text-lg text-gray-800 dark:text-gray-200 italic transition-opacity duration-500 bg-gradient-to-r from-white/80 to-purple-50/80 dark:from-gray-900/80 dark:to-purple-900/20 p-4 md:p-5 rounded-2xl border border-purple-200/30 dark:border-purple-800/30 backdrop-blur-sm">
                &quot;{currentMessage}&quot;
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            {state === "running" && (
              <Button
                onClick={pauseTimer}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-full" />
                <div className="relative z-10 flex items-center gap-2 md:gap-3">
                  <div className="p-1 md:p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <Pause className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <span>Pause</span>
                </div>
              </Button>
            )}

            {state === "paused" && (
              <Button
                onClick={resumeTimer}
                className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-full" />
                <div className="relative z-10 flex items-center gap-2 md:gap-3">
                  <div className="p-1 md:p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <Play className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <span>Resume</span>
                </div>
              </Button>
            )}

            {(state === "running" || state === "paused") && (
              <Button
                onClick={resetTimer}
                variant="outline"
                className="border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 group backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1 md:p-1.5 rounded-full bg-gray-100/50 dark:bg-gray-800/50">
                    <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <span>Reset</span>
                </div>
              </Button>
            )}

            {state === "completed" && (
              <Button
                onClick={resetTimer}
                className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-full" />
                <div className="relative z-10 flex items-center gap-2 md:gap-3">
                  <div className="p-1 md:p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <span>Start New Session</span>
                </div>
              </Button>
            )}

            <Button
              onClick={toggleSound}
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full w-12 h-12 md:w-14 md:h-14 transition-all duration-300 hover:scale-110 active:scale-95 group relative overflow-hidden backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                soundEnabled
                  ? "bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 text-white shadow-lg"
                  : "bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 border border-gray-300/50 dark:border-gray-600/50"
              )}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-full" />
              <div className="relative z-10">
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5 md:h-7 md:w-7" />
                ) : (
                  <VolumeX className="h-5 w-5 md:h-7 md:w-7" />
                )}
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
