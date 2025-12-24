// hooks/use-audio-player.ts
import { useCallback, useRef } from "react";

export const useAudioPlayer = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const beepAudioRef = useRef<HTMLAudioElement | null>(null);

  const playClick = useCallback(() => {
    // Try HTML5 Audio first
    if (!clickAudioRef.current) {
      clickAudioRef.current = new Audio();
      clickAudioRef.current.src = "/media/click.mp3";
      clickAudioRef.current.volume = 0.3;
    }

    try {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {
        playClickFallback();
      });
    } catch {
      playClickFallback();
    }
  }, []);

  const playClickFallback = useCallback(() => {
    // Fallback to Web Audio API
    try {
      if (!audioContextRef.current) {
        // Use type assertion for webkitAudioContext
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;

        if (!AudioContextClass) {
          return;
        }

        audioContextRef.current = new AudioContextClass();
      }

      const audioContext = audioContextRef.current;
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 600;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch {
      // Silently fail if audio is not supported
    }
  }, []);

  const playBeep = useCallback(() => {
    // Play beep sound
    if (!beepAudioRef.current) {
      beepAudioRef.current = new Audio();
      beepAudioRef.current.src = "/media/beep.mp3";
      beepAudioRef.current.volume = 0.5;
    }

    try {
      beepAudioRef.current.currentTime = 0;
      beepAudioRef.current.play().catch(() => {
        playBeepFallback();
      });
    } catch {
      playBeepFallback();
    }

    // Also show notification
    showNotification();
  }, []);

  const playBeepFallback = useCallback(() => {
    // Fallback beep with Web Audio API
    try {
      if (!audioContextRef.current) {
        // Use type assertion for webkitAudioContext
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;

        if (!AudioContextClass) {
          return;
        }

        audioContextRef.current = new AudioContextClass();
      }

      const audioContext = audioContextRef.current;
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 2
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
    } catch {
      // Silently fail if audio is not supported
    }
  }, []);

  const showNotification = useCallback(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("FocusFlow Timer Complete!", {
          body: "Your focus session has ended.",
          icon: "/favicon.ico",
          requireInteraction: true,
        });
      } else if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("FocusFlow Timer Complete!", {
              body: "Your focus session has ended.",
              icon: "/favicon.ico",
              requireInteraction: true,
            });
          }
        });
      }
    }
  }, []);

  return { playClick, playBeep };
};
