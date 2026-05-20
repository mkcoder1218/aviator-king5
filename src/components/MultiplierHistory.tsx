import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PastRound } from '../types';
import { getMultiplierColor, getMultiplierBgColor, getMultiplierBorderColor } from '../utils';

interface MultiplierHistoryProps {
  history: PastRound[];
  onOpenHistoryModal: () => void;
}

export default function MultiplierHistory({ history, onOpenHistoryModal }: MultiplierHistoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to the left when history updates so that the newest multiplier is always fully visible
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
    }
  }, [history]);

  return (
    <div className="flex items-center justify-between bg-[#141516] border-b border-[#1c1d1e] px-4 py-1.5 select-none h-9 relative overflow-hidden">
      {/* Scrollable list of multipliers */}
      <div 
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pr-12 scroll-smooth w-full select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <AnimatePresence initial={false}>
          {history.map((round) => {
            const color = getMultiplierColor(round.multiplier);
            const bgColor = getMultiplierBgColor(round.multiplier);
            const borderCol = getMultiplierBorderColor(round.multiplier);
            
            return (
              <motion.div
                key={round.id}
                initial={{ opacity: 0, scale: 0.8, x: -15 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <div
                  style={{
                    color: color,
                    backgroundColor: bgColor,
                    borderColor: borderCol,
                  }}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border font-sans pointer-events-auto hover:brightness-125 transition-all text-center min-w-[50px] cursor-help"
                  title={`Crashed at ${round.multiplier}x — Click for details`}
                  onClick={() => alert(`Provably Fair details for round ${round.id}:\nMultiplier: ${round.multiplier}x\nTimestamp: ${round.timestamp}\nVerification Hash: ${Math.random().toString(36).substring(2, 15)}ae${Math.random().toString(36).substring(2, 15)}`)}
                >
                  {round.multiplier.toFixed(2)}x
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Extreme Right History expander button */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center bg-gradient-to-l from-[#141516] via-[#141516] to-transparent pl-8 pr-3 pointer-events-none">
        <button
          onClick={onOpenHistoryModal}
          className="bg-[#1c1d1e] hover:bg-[#252729] hover:text-[#fff] text-[#8e8f90] text-[10px] h-[22px] px-2 rounded-sm flex items-center gap-0.5 border border-[#2b2c2d] active:scale-95 duration-100 cursor-pointer pointer-events-auto"
        >
          {/* A visual of clock-like history icon or three lines */}
          <span className="font-sans font-bold text-[10.5px]">🕒</span>
          <span className="text-[7px]">▼</span>
        </button>
      </div>
    </div>
  );
}
