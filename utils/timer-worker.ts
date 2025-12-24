// app/utils/timer-worker.ts
export const createTimerWorker = () => {
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
  const workerURL = URL.createObjectURL(blob);
  return new Worker(workerURL);
};
