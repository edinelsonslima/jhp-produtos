import { m, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

export function useSaleCelebration() {
  const [show, setShow] = useState(false);

  const celebrate = useCallback(() => {
    playCashSound();
    setShow(true);
  }, []);

  const onComplete = useCallback(() => setShow(false), []);

  return { show, onComplete, celebrate };
}

function playCashSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.05);
    osc.frequency.setValueAtTime(2000, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(2400, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(3000, ctx.currentTime + 0.2);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc2.start(ctx.currentTime + 0.2);
    osc2.stop(ctx.currentTime + 0.6);
  } catch {
    // Audio not supported
  }
}

export function SaleCelebration({
  show,
  onComplete,
}: {
  show: boolean;
  onComplete: () => void;
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <m.div
          className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <m.span
            className="text-7xl font-extrabold text-success drop-shadow-lg"
            style={{ textShadow: "0 4px 20px rgba(0,200,0,0.3)" }}
            initial={{ y: "60vh", scale: 0.5, opacity: 0 }}
            animate={{
              y: [300, 0, -10, 0, -5, 0, -200],
              scale: [0.5, 1.3, 1.1, 1.2, 1.15, 1.2, 0.8],
              opacity: [0, 1, 1, 1, 1, 1, 0],
            }}
            transition={{
              duration: 1.4,
              times: [0, 0.3, 0.4, 0.5, 0.55, 0.7, 1],
              ease: "easeOut",
            }}
          >
            $
          </m.span>
        </m.div>
      )}
    </AnimatePresence>
  );
}
