// page.tsx (updated)
"use client";

import { FocusTimer } from "@/components/focus-timer";
import { TaskManagerDescription } from "@/components/task-manager-description";
import { SkeletonCard } from "@/components/skeleton";
import { Suspense, useState } from "react";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showDescription, setShowDescription] = useState(true);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      {showWelcome && (
        <Suspense fallback={<WelcomeMessageFallback />}>
          <WelcomeMessage />
        </Suspense>
      )}
      <FocusTimer
        onTimerStart={() => {
          setShowWelcome(false);
          setShowDescription(false);
        }}
        onTimerReset={() => {
          setShowWelcome(true);
          setShowDescription(true);
        }}
      />
      {showDescription && <TaskManagerDescription />}
    </div>
  );
}

const WelcomeMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg max-w-2xl mx-auto my-8 transition-opacity duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Welcome to FocusFlow
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Your ultimate productivity companion for focused work sessions
        </p>
      </div>

      <div className="text-center w-full">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Start by setting your focus timer below
        </p>
      </div>
    </div>
  );
};

const WelcomeMessageFallback = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <SkeletonCard />
    </div>
  );
};
