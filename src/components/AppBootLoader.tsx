import { motion } from "motion/react";
import { useEffect, useState } from "react";

const radius = 38;
const circumference = 2 * Math.PI * radius;

export function AppBootLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2200;
    const start = performance.now();
    let frameId = 0;

    const tick = (time: number) => {
      const next = Math.min(100, ((time - start) / duration) * 100);
      setProgress(next);

      if (next < 100) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, []);

  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fcfaf6] text-primary-dark">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(164,210,180,0.18),transparent_42%),radial-gradient(circle_at_bottom,_rgba(232,181,99,0.15),transparent_35%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-6 flex items-center justify-center">
          <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(31, 58, 45, 0.12)"
              strokeWidth="8"
            />
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#1d5b4d"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-primary text-2xl font-bold text-white shadow-soft">
              H
            </div>
          </div>
        </div>

        <div className="mb-2 text-center">
          <div className="text-[11px] font-black uppercase tracking-[0.36em] text-primary-dark/80">
            Huye Finds
          </div>
          <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-primary-dark/60">
            Preparing your campus guide
          </div>
        </div>

        <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
          {Math.round(progress)}%
        </div>
      </motion.div>
    </div>
  );
}
