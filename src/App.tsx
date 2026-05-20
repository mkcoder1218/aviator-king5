import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { GameState, PlayerBet, PastRound, PanelBetState } from './types';
import { generateBots, generateCrashPoint, generateInitials } from './utils';
import Header from './components/Header';
import MultiplierHistory from './components/MultiplierHistory';
import BetsSidebar from './components/BetsSidebar';
import GameCanvas from './components/GameCanvas';
import BetControl from './components/BetControl';
import LoadingScreen from './components/LoadingScreen';

// Initial preloaded list matching the screenshot history multipliers exactly!
const INITIAL_HISTORY: PastRound[] = [
  { id: '1', multiplier: 3.72, timestamp: '09:40:12' },
  { id: '2', multiplier: 3.31, timestamp: '09:39:44' },
  { id: '3', multiplier: 3.02, timestamp: '09:39:10' },
  { id: '4', multiplier: 1.44, timestamp: '09:38:35' },
  { id: '5', multiplier: 1.86, timestamp: '09:37:58' },
  { id: '6', multiplier: 3.96, timestamp: '09:37:22' },
  { id: '7', multiplier: 1.73, timestamp: '09:36:51' },
  { id: '8', multiplier: 1.20, timestamp: '09:36:14' },
  { id: '9', multiplier: 2.41, timestamp: '09:35:40' },
  { id: '10', multiplier: 1.08, timestamp: '09:35:10' },
  { id: '11', multiplier: 1.05, timestamp: '09:34:39' },
  { id: '12', multiplier: 3.43, timestamp: '09:34:02' },
  { id: '13', multiplier: 2.43, timestamp: '09:33:31' },
  { id: '14', multiplier: 2.17, timestamp: '09:32:59' },
  { id: '15', multiplier: 1.39, timestamp: '09:32:21' },
  { id: '16', multiplier: 2.57, timestamp: '09:31:50' },
  { id: '17', multiplier: 1.00, timestamp: '09:31:11' },
  { id: '18', multiplier: 1.00, timestamp: '09:30:38' },
  { id: '19', multiplier: 2.20, timestamp: '09:30:04' },
  { id: '20', multiplier: 1.00, timestamp: '09:29:32' },
  { id: '21', multiplier: 2.31, timestamp: '09:28:59' },
  { id: '22', multiplier: 2.83, timestamp: '09:28:22' },
  { id: '23', multiplier: 1.00, timestamp: '09:27:48' },
  { id: '24', multiplier: 4.57, timestamp: '09:27:12' },
  { id: '25', multiplier: 1.15, timestamp: '09:26:40' },
];

export default function App() {
  // App-wide loading screen state matching the UFC Aviator launch screen
  const [appLoading, setAppLoading] = useState(true);

  // Mobile sidebar draw state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Master balance manager
  const [balance, setBalance] = useState<number>(30000.00);

  // Core Game Loop variables
  const [gameState, setGameState] = useState<GameState>('WAITING');
  const [multiplier, setMultiplier] = useState<number>(1.00);
  const [countdown, setCountdown] = useState<number>(5.00);
  const totalCountdown = 5.00; // Const countdown length (5s) before planes taxi and takeoff

  const [history, setHistory] = useState<PastRound[]>(INITIAL_HISTORY);
  
  // Real-time fluctuating observer counts
  const [activePlayersCount, setActivePlayersCount] = useState<number>(215);

  // Active round multiplayer user registry
  const [activeBets, setActiveBets] = useState<PlayerBet[]>([]);
  const [totalBetsCount, setTotalBetsCount] = useState<number>(280);

  // User past plays logs
  const [myHistory, setMyHistory] = useState<{
    timestamp: string;
    betAmount: number;
    cashoutMultiplier?: number;
    winAmount?: number;
    didWin: boolean;
  }[]>([]);

  // Two independent panel bet states mapping to layout controls
  const [panelBets, setPanelBets] = useState<PanelBetState[]>([
    {
      isPlaced: false,
      isQueued: false,
      amount: 1.00,
      isCashedOut: false,
      autoBet: false,
      autoCashout: false,
      autoCashoutValue: 2.00,
    },
    {
      isPlaced: false,
      isQueued: false,
      amount: 1.00,
      isCashedOut: false,
      autoBet: false,
      autoCashout: false,
      autoCashoutValue: 2.00,
    },
  ]);

  // Timestamps hooks
  const startTimeRef = useRef<number>(0);
  const crashPointRef = useRef<number>(1.50);
  const stateUpdateIntervalRef = useRef<any>(null);

  // Visual success fly out toast indicators
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refill balance callback
  const handleRefill = () => {
    if (balance < 100) {
      setBalance(30000.00);
      showToast('Account Refilled to $30k USD!');
    } else {
      showToast('Balance is already healthy!');
    }
  };

  // Helper toaster trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handle placing standard bets manually
  const handlePlaceBet = (panelIndex: number, amount: number) => {
    if (balance < amount) {
      showToast('Insufficient funds on balance!');
      return;
    }
    
    setPanelBets((prev) => {
      const next = [...prev];
      next[panelIndex] = {
        ...next[panelIndex],
        isPlaced: true,
        isQueued: false,
        isCashedOut: false,
        cashoutMultiplier: undefined,
        winAmount: undefined,
      };
      return next;
    });

    showToast(`Bet of $${amount.toFixed(2)} USD placed!`);
  };

  // Safe cancel queues before plane ascends
  const handleCancelQueuedBet = (panelIndex: number) => {
    setPanelBets((prev) => {
      const next = [...prev];
      next[panelIndex] = {
        ...next[panelIndex],
        isPlaced: false,
        isQueued: false,
      };
      return next;
    });
    showToast('Bet cancelled safely.');
  };

  // Manual trigger for cashouts during active flight
  const handleCashOut = (panelIndex: number) => {
    const bet = panelBets[panelIndex];
    if (!bet.isPlaced || bet.isCashedOut || gameState !== 'FLYING') return;

    const currentMultiplier = multiplier;
    const payout = bet.amount * currentMultiplier;

    // Credit profits instantly
    setBalance((prev) => prev + payout);

    // Flag panel as completed
    setPanelBets((prev) => {
      const next = [...prev];
      next[panelIndex] = {
        ...next[panelIndex],
        isCashedOut: true,
        cashoutMultiplier: currentMultiplier,
        winAmount: payout,
      };
      return next;
    });

    // Mirror user cashing status immediately onto tabular sidebar list
    setActiveBets((prev) =>
      prev.map((item) =>
        item.isUser && item.panelIndex === panelIndex
          ? {
              ...item,
              isCashedOut: true,
              cashoutMultiplier: currentMultiplier,
              winAmount: payout,
            }
          : item
      )
    );

    // Save logs
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setMyHistory((prev) => [
      {
        timestamp: timeStr,
        betAmount: bet.amount,
        cashoutMultiplier: currentMultiplier,
        winAmount: payout,
        didWin: true,
      },
      ...prev,
    ]);

    showToast(`SUCCESS! Cashed out at ${currentMultiplier.toFixed(2)}x (+ $${payout.toFixed(2)} USD)`);
  };

  // Helper toggle updates for configuration models
  const handleUpdateBetState = (panelIndex: number, updates: Partial<PanelBetState>) => {
    setPanelBets((prev) => {
      const next = [...prev];
      next[panelIndex] = {
        ...next[panelIndex],
        ...updates,
      };
      return next;
    });
  };

  // Clock state fluctuations observer counts
  useEffect(() => {
    const driftInterval = setInterval(() => {
      setActivePlayersCount((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4; // fluctuates -4 to +4
        return Math.max(180, Math.min(265, prev + delta));
      });
    }, 4000);
    return () => clearInterval(driftInterval);
  }, []);

  // Main High Frequency coordination Loop
  useEffect(() => {
    stateUpdateIntervalRef.current = setInterval(() => {
      const now = Date.now();

      if (gameState === 'WAITING') {
        const elapsed = (now - startTimeRef.current) / 1000;
        const remaining = Math.max(0, totalCountdown - elapsed);
        setCountdown(remaining);

        if (remaining <= 0) {
          // Pre-calculate crash point limit
          const chosenCrash = generateCrashPoint();
          crashPointRef.current = chosenCrash;

          // 1. Process and Deduct Active funds for takeoff
          let currentBalance = balance;
          const userBetsToRegister: PlayerBet[] = [];

          const nextPanelBets = panelBets.map((bet, idx) => {
            // Auto Promotion of queued or pre-placed bets
            const activeToLaunch = bet.isPlaced || bet.isQueued || bet.autoBet;
            if (activeToLaunch) {
              if (currentBalance >= bet.amount) {
                currentBalance -= bet.amount;
                // Log and push onto local round list
                userBetsToRegister.push({
                  id: `user_bet_${idx}_${now}`,
                  username: `You (Panel ${idx + 1})`,
                  avatarColor: '#ea580c',
                  avatarInitials: 'Y',
                  betAmount: bet.amount,
                  isCashedOut: false,
                  isUser: true,
                  panelIndex: idx,
                });

                return {
                  ...bet,
                  isPlaced: true,
                  isQueued: false,
                  isCashedOut: false,
                  cashoutMultiplier: undefined,
                  winAmount: undefined,
                };
              } else {
                return {
                  ...bet,
                  isPlaced: false,
                  isQueued: false,
                };
              }
            }
            return bet;
          });

          // Sync computed balances
          setBalance(currentBalance);
          setPanelBets(nextPanelBets);

          // 2. Generate active bots
          const botCount = 18 + Math.floor(Math.random() * 15);
          setTotalBetsCount(botCount + userBetsToRegister.length);
          
          const botsList = generateBots(botCount);
          setActiveBets([...userBetsToRegister, ...botsList]);

          // Shift state to flying
          startTimeRef.current = Date.now();
          setMultiplier(1.00);
          setGameState('FLYING');
        }
      } else if (gameState === 'FLYING') {
        const elapsedS = (now - startTimeRef.current) / 1000;
        
        // Pacing formula: Exponential takeoff curves
        // Multiplier starting at 1.00x and speeds up over time (incremented speed)
        const calculatedMultiplier = Math.pow(1.09, elapsedS * 1.52);
        const roundedMult = Math.round(calculatedMultiplier * 100) / 100;

        // Check crash boundaries
        if (roundedMult >= crashPointRef.current) {
          // CLASH! Game crashed! Save crash statistics
          const finishedCrash = crashPointRef.current;
          setMultiplier(finishedCrash);
          setGameState('CRASHED');
          startTimeRef.current = Date.now(); // benchmark duration of crash delay

          // Add past round record into history panel
          const d = new Date();
          const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setHistory((prev) => [
            { id: String(Date.now()), multiplier: finishedCrash, timestamp: timeStr },
            ...prev,
          ]);

          // Handle losses for users who haven't cashed out in time
          setPanelBets((prev) => {
            const next = prev.map((bet) => {
              if (bet.isPlaced && !bet.isCashedOut) {
                // Log loss details
                setMyHistory((hist) => [
                  {
                    timestamp: timeStr,
                    betAmount: bet.amount,
                    didWin: false,
                  },
                  ...hist,
                ]);
                return {
                  ...bet,
                  isPlaced: false,
                  isQueued: false,
                };
              }
              return bet;
            });
            return next;
          });

        } else {
          // Multiplier continues climbing normally
          setMultiplier(roundedMult);

          // 1. Check Bot Cashouts and evaluate triggers dynamically
          setActiveBets((prevBets) =>
            prevBets.map((b) => {
              if (!b.isUser && !b.isCashedOut && b.cashoutTarget && roundedMult >= b.cashoutTarget) {
                return {
                  ...b,
                  isCashedOut: true,
                  cashoutMultiplier: b.cashoutTarget,
                  winAmount: Math.round(b.betAmount * b.cashoutTarget * 100) / 100,
                };
              }
              return b;
            })
          );

          // 2. Check User Auto Cashout checks
          setPanelBets((prevPanels) => {
            let currentBalanceBonus = 0;
            const updatedPanels = prevPanels.map((bet, idx) => {
              if (
                bet.isPlaced &&
                !bet.isCashedOut &&
                bet.autoCashout &&
                roundedMult >= bet.autoCashoutValue
              ) {
                const targetValue = bet.autoCashoutValue;
                const profitAmount = bet.amount * targetValue;
                currentBalanceBonus += profitAmount;

                // Sync immediately on tabular lists coordinates
                setActiveBets((prevTable) =>
                  prevTable.map((tblBet) =>
                    tblBet.isUser && tblBet.panelIndex === idx
                      ? {
                          ...tblBet,
                          isCashedOut: true,
                          cashoutMultiplier: targetValue,
                          winAmount: profitAmount,
                        }
                      : tblBet
                  )
                );

                // Save user history logs
                const autoNow = new Date();
                const autoTimeStr = autoNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setMyHistory((prevHist) => [
                  {
                    timestamp: autoTimeStr,
                    betAmount: bet.amount,
                    cashoutMultiplier: targetValue,
                    winAmount: profitAmount,
                    didWin: true,
                  },
                  ...prevHist,
                ]);

                // Play toast
                showToast(`Auto cashout hit at ${targetValue.toFixed(2)}x (+ $${profitAmount.toFixed(2)} USD)`);

                return {
                  ...bet,
                  isCashedOut: true,
                  cashoutMultiplier: targetValue,
                  winAmount: profitAmount,
                };
              }
              return bet;
            });

            if (currentBalanceBonus > 0) {
              setBalance((prevBal) => prevBal + currentBalanceBonus);
            }
            return updatedPanels;
          });
        }
      } else if (gameState === 'CRASHED') {
        const elapsedS = (now - startTimeRef.current) / 1000;
        // Wait 3 full seconds under flown away state before resetting
        if (elapsedS >= 3.0) {
          // Flush active bets round indexes
          setActiveBets([]);
          
          setPanelBets((prev) =>
            prev.map((bet) => ({
              ...bet,
              isPlaced: false,
              isCashedOut: false,
            }))
          );

          // Return to WAITING lobby countdown
          setGameState('WAITING');
          setCountdown(5.00);
          startTimeRef.current = Date.now();
        }
      }
    }, 45); // highly balanced smooth ticks speed with zero lag

    return () => {
      clearInterval(stateUpdateIntervalRef.current);
    };
  }, [gameState, multiplier, balance, panelBets]);

  // Launch initial game timer
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  return (
    <div id="game_root" className="h-screen h-[100dvh] w-screen max-w-full overflow-hidden bg-[#0e0f10] text-[#f8fafc] flex flex-col relative select-none font-sans">
      
      <AnimatePresence>
        {appLoading && (
          <LoadingScreen onFinish={() => setAppLoading(false)} />
        )}
      </AnimatePresence>
      
      {/* 1. Header component - Branding, Balance */}
      <Header 
        balance={balance} 
        onRefill={handleRefill} 
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)} 
      />

      {/* 2. Main content block - Splits Sidebar left and flight controls right */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* Dynamic Mobile Backdrop Drawer Filter overlay */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute inset-0 bg-[#000000]/70 z-40 transition-opacity duration-200"
          />
        )}

        {/* Sidebar displaying active bets, history, top players */}
        <div className={`
          ${sidebarOpen ? 'flex absolute inset-y-0 left-0 z-50 bg-[#101112] shadow-2xl w-[280px]' : 'hidden'} 
          md:flex md:relative md:w-[305px] h-full flex-shrink-0 overflow-hidden
        `}>
          <BetsSidebar
            gameState={gameState}
            activeBets={activeBets}
            myHistory={myHistory}
            totalBetsCount={totalBetsCount}
          />
        </div>

        {/* Right side covering Canvas top and dual panels below */}
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          
          {/* Top horizontal history multipliers bar */}
          <MultiplierHistory 
            history={history} 
            onOpenHistoryModal={() => alert('Crash History Log:\nReview recently recorded flight values mapped by security seeds. Clear transparency built on true provably fair algorithms.')} 
          />

          {/* Canvas content and control block details */}
          <div className="flex-1 p-3.5 flex flex-col gap-3 ml-0.5 overflow-y-auto no-scrollbar">
            
            {/* The active drawing visual field */}
            <GameCanvas
              gameState={gameState}
              multiplier={multiplier}
              countdown={countdown}
              totalCountdown={totalCountdown}
              activePlayersCount={activePlayersCount}
            />

            {/* Dual bet control boxes side-by-side */}
            <div className="flex flex-wrap lg:flex-nowrap gap-3 shrink-0">
              {[0, 1].map((idx) => (
                <BetControl
                  key={idx}
                  panelIndex={idx}
                  gameState={gameState}
                  multiplier={multiplier}
                  balance={balance}
                  betState={panelBets[idx]}
                  onPlaceBet={handlePlaceBet}
                  onCancelQueuedBet={handleCancelQueuedBet}
                  onCashOut={handleCashOut}
                  onUpdateBetState={handleUpdateBetState}
                />
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* 3. Global Notification Floating Toasts */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9990] bg-[#1a1b1c] border border-[#22c55e]/30 px-5 py-2.5 rounded-md shadow-2xl flex items-center gap-2 max-w-[90%] md:max-w-sm animate-bounce text-center pointer-events-none">
          <span className="text-[#2cbf5a] text-[15px] font-extrabold">🚀</span>
          <span className="text-white text-[12px] font-bold tracking-wide font-sans leading-relaxed">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
