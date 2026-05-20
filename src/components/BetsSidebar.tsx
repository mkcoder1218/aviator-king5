import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { PlayerBet, GameState, PastRound } from '../types';
import { getMultiplierColor, getMultiplierBgColor } from '../utils';

interface BetsSidebarProps {
  gameState: GameState;
  activeBets: PlayerBet[];
  myHistory: {
    timestamp: string;
    betAmount: number;
    cashoutMultiplier?: number;
    winAmount?: number;
    didWin: boolean;
  }[];
  totalBetsCount: number;
}

export default function BetsSidebar({
  gameState,
  activeBets,
  myHistory,
  totalBetsCount,
}: BetsSidebarProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'previous' | 'top'>('all');

  // Multiplier-based ordering for the "Top" tab mock records
  const topBetsMock = [
    { username: 'a***5', bet: 200, multiplier: 84.15, win: 16830 },
    { username: 's***8', bet: 50, multiplier: 52.34, win: 2617 },
    { username: 'd***1', bet: 100, multiplier: 41.20, win: 4120 },
    { username: 'p***9', bet: 10, multiplier: 32.55, win: 325.5 },
    { username: 'r***2', bet: 100, multiplier: 24.31, win: 2431 },
    { username: 'm***7', bet: 5, multiplier: 18.23, win: 91.15 },
    { username: 'z***6', bet: 50, multiplier: 12.44, win: 622 },
  ];

  // Calculate the total winning sum of the active round
  const activeWinningsTotal = activeBets.reduce(
    (sum, bet) => sum + (bet.winAmount || 0),
    0
  );

  return (
    <div className="w-[305px] h-full flex flex-col bg-[#101112] border-r border-[#1c1d1e] select-none text-[12px] font-sans">
      {/* 1. Header with Tabs: All Bets, Previous, Top */}
      <div className="p-2 pb-1.5 flex justify-center bg-[#101112]">
        <div className="flex bg-[#000000] p-0.5 rounded-full w-full justify-between border border-[#191a1b]">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1 px-2 rounded-full font-semibold text-center cursor-pointer transition-all ${
              activeTab === 'all'
                ? 'bg-[#2b2c2d] text-white'
                : 'text-[#8e8f90] hover:text-[#fff]'
            }`}
          >
            All Bets
          </button>
          <button
            onClick={() => setActiveTab('previous')}
            className={`flex-1 py-1 px-2 rounded-full font-semibold text-center cursor-pointer transition-all ${
              activeTab === 'previous'
                ? 'bg-[#2b2c2d] text-white'
                : 'text-[#8e8f90] hover:text-[#fff]'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setActiveTab('top')}
            className={`flex-1 py-1 px-2 rounded-full font-semibold text-center cursor-pointer transition-all ${
              activeTab === 'top'
                ? 'bg-[#2b2c2d] text-white'
                : 'text-[#8e8f90] hover:text-[#fff]'
            }`}
          >
            Top
          </button>
        </div>
      </div>

      {/* 2. active round bet stats summary banner (Only relevant or displayed on ALL BETS) */}
      {activeTab === 'all' && (
        <div className="px-3 py-1 flex items-center justify-between bg-[#151617] border-y border-[#1c1d1e]">
          {/* Avatar bubbles cluster */}
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1.5 overflow-hidden">
              <span className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-[#151617] bg-[#ca8a04]" />
              <span className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-[#151617] bg-[#16a34a]" />
              <span className="inline-block h-3.5 w-3.5 rounded-full ring-1 ring-[#151617] bg-[#2563eb]" />
            </div>
            <div className="text-[#8e8f90] text-[11px] font-bold">
              <span className="text-[#ffffff] pr-1">{totalBetsCount}</span> Bets
            </div>
          </div>
          
          <div className="text-[#8e8f90] text-[11px] font-medium font-sans">
            Total Win: <span className="text-[#2cbf5a] font-bold">{activeWinningsTotal > 0 ? `${activeWinningsTotal.toFixed(2)} USD` : '0.00 USD'}</span>
          </div>
        </div>
      )}

      {/* 3. Table Headers */}
      <div className="grid grid-cols-4 px-3 py-1 bg-[#101112] text-[#525354] font-bold text-[10px] select-none border-b border-[#18191a]">
        <div>PLAYER</div>
        <div className="text-right pr-2">BET USD</div>
        <div className="text-center">X</div>
        <div className="text-right pr-2">WIN USD</div>
      </div>

      {/* 4. Table Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#101112]">
        {activeTab === 'all' && (
          <div className="divide-y divide-[#18191a]/30">
            {activeBets.length === 0 ? (
              <div className="py-8 text-center text-[#525354] font-medium">No active bets yet</div>
            ) : (
              activeBets.map((bet) => {
                const finishedRow = bet.isCashedOut;
                return (
                  <div
                    key={bet.id}
                    className={`grid grid-cols-4 px-3 py-1.5 items-center transition-all duration-300 font-sans ${
                      finishedRow ? 'bg-[#1a1c1a]/30' : 'bg-[#101112]'
                    }`}
                  >
                    {/* Player column */}
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <div
                        style={{ backgroundColor: bet.avatarColor }}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-[#f8fafc] flex-shrink-0"
                      >
                        {bet.avatarInitials}
                      </div>
                      <span className="text-[#969798] text-[11px] truncate">{bet.username}</span>
                    </div>

                    {/* Bet Amount */}
                    <div className="text-right text-[#969798] pr-2 font-mono text-[11px]">
                      {bet.betAmount.toFixed(2)}
                    </div>

                    {/* X column (Pill on cashout) */}
                    <div className="flex justify-center items-center">
                      {finishedRow && bet.cashoutMultiplier ? (
                        <span
                          style={{
                            color: bet.cashoutMultiplier < 2 ? '#419af9' : '#913df2',
                            backgroundColor: bet.cashoutMultiplier < 2 ? 'rgba(65, 154, 249, 0.15)' : 'rgba(145, 61, 242, 0.15)',
                            borderColor: bet.cashoutMultiplier < 2 ? 'rgba(65, 154, 249, 0.3)' : 'rgba(145, 61, 242, 0.3)',
                          }}
                          className="px-1.5 py-0.5 rounded-full text-[9.5px] font-extrabold border leading-none scale-90"
                        >
                          {bet.cashoutMultiplier.toFixed(2)}x
                        </span>
                      ) : (
                        <span className="text-[#3b3c3d] font-bold">-</span>
                      )}
                    </div>

                    {/* Win USD amount */}
                    <div className={`text-right pr-2 font-mono font-bold text-[11px] ${
                      finishedRow ? 'text-[#2cbf5a]' : 'text-[#3c3d3e]'
                    }`}>
                      {finishedRow && bet.winAmount ? bet.winAmount.toFixed(2) : '-'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'previous' && (
          <div className="divide-y divide-[#18191a]/30">
            {myHistory.length === 0 ? (
              <div className="py-8 text-center text-[#525354] font-medium px-4">
                No past bets placed. Play a round!
              </div>
            ) : (
              myHistory.map((h, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-4 px-3 py-1.5 items-center ${
                    h.didWin ? 'bg-[#1a1c1a]/30' : 'bg-[#101112]'
                  }`}
                >
                  <div className="text-[#64748b] text-[10px] truncate">{h.timestamp}</div>
                  <div className="text-right text-[#969798] pr-2 font-mono text-[11px]">
                    {h.betAmount.toFixed(2)}
                  </div>
                  <div className="flex justify-center">
                    {h.didWin && h.cashoutMultiplier ? (
                      <span
                        style={{
                          color: h.cashoutMultiplier < 2 ? '#419af9' : '#913df2',
                          backgroundColor: h.cashoutMultiplier < 2 ? 'rgba(65, 154, 249, 0.1)' : 'rgba(145, 61, 242, 0.1)',
                        }}
                        className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold scale-90 leading-none"
                      >
                        {h.cashoutMultiplier.toFixed(2)}x
                      </span>
                    ) : (
                      <span className="text-[#ea580c] font-bold text-[9.5px] scale-90 border border-orange-500/20 px-1 py-0.2 rounded bg-orange-500/5">CRASH</span>
                    )}
                  </div>
                  <div className={`text-right pr-2 font-mono font-bold text-[11px] ${
                    h.didWin ? 'text-[#2cbf5a]' : 'text-[#ef4444]'
                  }`}>
                    {h.didWin && h.winAmount ? h.winAmount.toFixed(2) : '0.00'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'top' && (
          <div className="divide-y divide-[#18191a]/30">
            {topBetsMock.map((m, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 px-3 py-2 items-center bg-[#101112] hover:bg-[#151617] duration-150"
              >
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#facc15]" />
                  <span className="text-[#969798] font-bold text-[11px] truncate">{m.username}</span>
                </div>
                <div className="text-right text-[#969798] pr-2 font-mono text-[11px]">{m.bet.toFixed(2)}</div>
                <div className="flex justify-center">
                  <span className="px-1.5 py-0.5 rounded-full text-[9.5px] font-extrabold leading-none bg-indigo-900/40 text-indigo-400 border border-indigo-700/30">
                    {m.multiplier.toFixed(2)}x
                  </span>
                </div>
                <div className="text-right font-bold text-[#2cbf5a] font-mono pr-2 text-[11.5px]">
                  {m.win.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Sidebar Footer containing "Provably Fair" validation */}
      <footer className="h-9 px-3 border-t border-[#1c1d1e] bg-[#101112] flex items-center justify-between select-none shrink-0">
        {/* Provably fair check */}
        <div 
          onClick={() => alert('Provably Fair verification is active. Each multiplier result is strictly generated from combined server and player seeds before round initiation to prevent any server manipulation. Hash details can be audited using our open-source verifier.')}
          className="flex items-center gap-1 text-[#2cbf5a] hover:text-[#32d968] duration-150 cursor-pointer pointer-events-auto"
        >
          <ShieldCheck className="w-[14px] h-[14px] text-[#2cbf5a]" />
          <span className="text-[10px] font-bold uppercase tracking-wider select-none font-sans">
            Provably Fair Game
          </span>
        </div>

        {/* Powered by */}
        <div className="text-[#4b4c4d] text-[9.5px] font-semibold tracking-wide font-sans select-none">
          Powered by <span className="text-[#a4a5a6] font-extrabold text-[10px]">SPRIBE</span>
        </div>
      </footer>
    </div>
  );
}
