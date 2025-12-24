// public/timer-worker.js
let timerInterval = null;
let timerStartTime = null;
let timerDuration = 0;

self.onmessage = function (e) {
  const { type, duration, pauseTime } = e.data;

  switch (type) {
    case "start":
      // Clear any existing timer
      if (timerInterval) {
        clearInterval(timerInterval);
      }

      // Start new timer
      timerDuration = duration;
      timerStartTime = Date.now();

      timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
        const remaining = Math.max(0, timerDuration - elapsed);

        // Send update every second
        self.postMessage({
          type: "tick",
          remaining,
          elapsed,
        });

        // Send completion
        if (remaining <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          self.postMessage({ type: "completed" });
        }
      }, 1000);
      break;

    case "pause":
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        // Calculate remaining time
        const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
        const remaining = Math.max(0, timerDuration - elapsed);
        self.postMessage({
          type: "paused",
          remaining,
        });
      }
      break;

    case "resume":
      if (!timerInterval && timerStartTime && timerDuration > 0) {
        // Calculate new start time based on remaining time
        const remaining =
          timerDuration - Math.floor((pauseTime - timerStartTime) / 1000);
        timerDuration = remaining;
        timerStartTime = Date.now() - (timerDuration - remaining) * 1000;

        timerInterval = setInterval(() => {
          const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
          const remaining = Math.max(0, timerDuration - elapsed);

          self.postMessage({
            type: "tick",
            remaining,
            elapsed,
          });

          if (remaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            self.postMessage({ type: "completed" });
          }
        }, 1000);
      }
      break;

    case "stop":
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      timerStartTime = null;
      timerDuration = 0;
      self.postMessage({ type: "stopped" });
      break;

    case "getState":
      if (timerStartTime) {
        const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
        const remaining = Math.max(0, timerDuration - elapsed);
        self.postMessage({
          type: "state",
          remaining,
          isRunning: timerInterval !== null,
        });
      }
      break;
  }
};
