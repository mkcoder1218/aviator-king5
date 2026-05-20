import { useState, useEffect } from 'react';
import { GameState, PanelBetState } from '../types';

interface BetControlProps {
  key?: number | string;
  panelIndex: number;
  gameState: GameState;
  multiplier: number;
  balance: number;
  betState: PanelBetState;
  onPlaceBet: (panelIndex: number, amount: number) => void;
  onCancelQueuedBet: (panelIndex: number) => void;
  onCashOut: (panelIndex: number) => void;
  onUpdateBetState: (panelIndex: number, updates: Partial<PanelBetState>) => void;
}

export default function BetControl({
  panelIndex,
  gameState,
  multiplier,
  balance,
  betState,
  onPlaceBet,
  onCancelQueuedBet,
  onCashOut,
  onUpdateBetState,
}: BetControlProps) {
  const [activeSubTab, setActiveSubTab] = useState<'bet' | 'auto'>('bet');

  // Sync state modifications
  const handleAmountChange = (newAmount: number) => {
    // Round to 2 decimals, restrict between 1 and remaining balance
    const clampedAmount = Math.max(1, Math.min(balance || 30000, Math.round(newAmount * 100) / 100));
    onUpdateBetState(panelIndex, { amount: clampedAmount });
  };

  const incrementAmount = () => {
    handleAmountChange(betState.amount + 1.00);
  };

  const decrementAmount = () => {
    handleAmountChange(betState.amount - 1.00);
  };

  // Preset values replacement handler
  const selectPreset = (val: number) => {
    handleAmountChange(val);
  };

  // Handles clicking the main action button
  const handleActionClick = () => {
    if (gameState === 'FLYING') {
      if (betState.isPlaced && !betState.isCashedOut) {
        // Active in current flying round: Cash out!
        onCashOut(panelIndex);
      } else if (betState.isQueued) {
        // Cancel queued bet
        onCancelQueuedBet(panelIndex);
      } else {
        // Place queued bet for NEXT round
        onUpdateBetState(panelIndex, { isQueued: true });
      }
    } else if (gameState === 'WAITING') {
      if (betState.isPlaced || betState.isQueued) {
        // Cancel before round takes off
        onCancelQueuedBet(panelIndex);
      } else {
        // Instantly place for upcoming round
        onPlaceBet(panelIndex, betState.amount);
      }
    } else if (gameState === 'CRASHED') {
      // Placing bet for coming round
      if (betState.isQueued) {
        onCancelQueuedBet(panelIndex);
      } else {
        onUpdateBetState(panelIndex, { isQueued: true });
      }
    }
  };

  // Get dynamic classes of main bet button depending on active simulation state
  const getButtonStylesAndLabel = () => {
    // Case 1: Active in flying round - Needs to cash out!
    if (gameState === 'FLYING' && betState.isPlaced && !betState.isCashedOut) {
      const liveWin = betState.amount * multiplier;
      return {
        bgColor: 'bg-[#d97706] hover:bg-[#b45309]', // Warm amber/orange
        borderColor: 'border-[#b45309]/50',
        textColor: 'text-[#ffffff]',
        label: 'CASH OUT',
        subLabel: `${liveWin.toFixed(2)} USD`,
        pulse: true,
      };
    }

    // Case 2: Placed or Queued before kickoff
    if (betState.isPlaced || betState.isQueued) {
      return {
        bgColor: 'bg-[#b91c1c] hover:bg-[#991b1b]', // Crimson Red
        borderColor: 'border-[#991b1b]/50',
        textColor: 'text-white',
        label: 'CANCEL',
        subLabel: `${betState.amount.toFixed(2)} USD`,
        pulse: false,
      };
    }

    // Default Case: Bet Button ready to be clicked
    return {
      bgColor: 'bg-[#2cbf5a] hover:bg-[#22a44a]', // Vibrant forest neon green
      borderColor: 'border-[#22a44a]/40',
      textColor: 'text-black font-black',
      label: 'BET',
      subLabel: `${betState.amount.toFixed(2)} USD`,
      pulse: false,
    };
  };

  const btnParams = getButtonStylesAndLabel();

  return (
    <div className="flex-1 bg-[#151617] border border-[#242526] rounded-sm p-3.5 select-none flex flex-col min-w-[280px]">
      {/* 1. Tab Bar Pill Toggle (Bet vs Auto) */}
      <div className="flex justify-center mb-3">
        <div className="flex bg-[#000000] p-0.5 rounded-full w-2/3 max-w-[160px] justify-between border border-[#242526]">
          <button
            onClick={() => setActiveSubTab('bet')}
            className={`flex-1 py-0.5 px-3 rounded-full text-[10.5px] font-bold text-center cursor-pointer duration-150 ${
              activeSubTab === 'bet'
                ? 'bg-[#2b2c2d] text-[#ffffff]'
                : 'text-[#8e8f90]'
            }`}
          >
            Bet
          </button>
          <button
            onClick={() => setActiveSubTab('auto')}
            className={`flex-1 py-0.5 px-3 rounded-full text-[10.5px] font-bold text-center cursor-pointer duration-150 ${
              activeSubTab === 'auto'
                ? 'bg-[#2b2c2d] text-[#ffffff]'
                : 'text-[#8e8f90]'
            }`}
          >
            Auto
          </button>
        </div>
      </div>

      {/* 2. Main Row containing: Control Panel (on Left) & Bet Button (on Right) */}
      <div className="grid grid-cols-2 gap-3.5 items-stretch">
        
        {/* Left Column: Number Dial & Preset Pill Matrix */}
        <div className="flex flex-col justify-between gap-2.5">
          {/* Numeric adjuster: Minus, input field, Plus */}
          <div className="flex items-center justify-between bg-[#000000] rounded-full px-2 py-1 border border-[#242526] h-[36px]">
            <button
              onClick={decrementAmount}
              className="w-6 h-6 rounded-full bg-[#1c1d1e] border border-[#2b2c2d] hover:bg-[#252729] text-[#969798] hover:text-[#ffffff] duration-150 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              -
            </button>
            
            <input
              type="number"
              value={betState.amount || ''}
              onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 1)}
              className="bg-transparent text-white font-extrabold w-16 text-center focus:outline-none focus:ring-0 font-mono text-[14px]"
            />
            
            <button
              onClick={incrementAmount}
              className="w-6 h-6 rounded-full bg-[#1c1d1e] border border-[#2b2c2d] hover:bg-[#252729] text-[#969798] hover:text-[#ffffff] duration-150 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Grid matrix of presets (1, 2, 5, 10 USD) */}
          <div className="grid grid-cols-2 gap-1.5">
            {[1, 2, 5, 10].map((preset) => (
              <button
                key={preset}
                onClick={() => selectPreset(preset)}
                className={`py-0.5 rounded-full border text-[11px] font-bold font-sans cursor-pointer duration-150 text-center ${
                  betState.amount === preset
                    ? 'bg-[#1c1d1e] border-[#2cbf5a] text-[#ffffff]'
                    : 'bg-[#1a1b1c] border-[#222324] text-[#8e8f90] hover:text-[#fff] hover:border-[#353637]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Giant Bet Button */}
        <button
          onClick={handleActionClick}
          className={`flex flex-col justify-center items-center rounded-xl p-3 border cursor-pointer border-opacity-40 transition-all select-none duration-150 text-center min-h-[80px] shadow-lg active:scale-[0.98] ${
            btnParams.bgColor
          } ${btnParams.pulse ? 'animate-pulse' : ''}`}
        >
          <span className={`text-[15px] tracking-wider uppercase font-extrabold ${
            btnParams.label === 'BET' ? 'text-black' : 'text-white'
          }`}>
            {btnParams.label}
          </span>
          <span className={`text-[13px] font-black mt-0.5 font-mono ${
            btnParams.label === 'BET' ? 'text-black/80' : 'text-white/80'
          }`}>
            {btnParams.subLabel}
          </span>
        </button>
      </div>

      {/* 3. Dropdown Auto Config Tray (Only displayed when AUTO tab toggle active) */}
      {activeSubTab === 'auto' && (
        <div className="mt-3.5 pt-3 border-t border-[#1c1d1e]/80 flex flex-col gap-2.5 bg-[#101112]/40 rounded-sm p-2">
          {/* Autotriggers checklist toggles */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-[#8e8f90] text-[10px] font-bold uppercase tracking-wide">
              <input
                type="checkbox"
                checked={betState.autoBet}
                onChange={(e) => onUpdateBetState(panelIndex, { autoBet: e.target.checked })}
                className="w-3.5 h-3.5 accent-[#2cbf5a] rounded-sm bg-black border-none cursor-pointer"
              />
              Auto Bet
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#8e8f90] text-[10px] font-bold uppercase tracking-wide">
              <input
                type="checkbox"
                checked={betState.autoCashout}
                onChange={(e) => onUpdateBetState(panelIndex, { autoCashout: e.target.checked })}
                className="w-3.5 h-3.5 accent-[#2cbf5a] rounded-sm bg-black border-none cursor-pointer"
              />
              Auto Cashout
            </label>
          </div>

          {/* Auto Cashout multiplier input threshold triggers */}
          {betState.autoCashout && (
            <div className="flex items-center justify-between border-t border-[#1c1d1e]/40 pt-2 gap-2">
              <span className="text-[#8e8f90] text-[10px] font-bold uppercase tracking-normal">Threshold Multiplier:</span>
              <div className="flex items-center bg-[#000000] rounded-sm px-1.5 py-0.5 border border-[#242526] h-[26px]">
                <input
                  type="number"
                  step="0.01"
                  min="1.01"
                  value={betState.autoCashoutValue || ''}
                  onChange={(e) =>
                    onUpdateBetState(panelIndex, {
                      autoCashoutValue: Math.max(1.01, parseFloat(e.target.value) || 1.5),
                    })
                  }
                  className="bg-transparent text-[#2cbf5a] font-black w-14 text-right focus:outline-none font-mono text-xs"
                />
                <span className="text-[#525354] font-extrabold text-[10.5px] pl-0.5">X</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
