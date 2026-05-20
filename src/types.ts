export type GameState = 'WAITING' | 'FLYING' | 'CRASHED';

export interface PlayerBet {
  id: string;
  username: string;
  avatarColor: string;
  avatarInitials: string;
  betAmount: number;
  cashoutMultiplier?: number;
  winAmount?: number;
  isCashedOut: boolean;
  cashoutTarget?: number; // Pre-calculated target multiplier for bot simulation
  isUser?: boolean;
  panelIndex?: number; // 0 for left user panel, 1 for right user panel
}

export interface PastRound {
  id: string;
  multiplier: number;
  timestamp: string;
}

export interface PanelBetState {
  isPlaced: boolean; // Bet is fully active on the current flying round
  isQueued: boolean; // Placed during a flying round, waiting for the NEXT round
  amount: number;
  isCashedOut: boolean;
  cashoutMultiplier?: number;
  winAmount?: number;
  autoBet: boolean;
  autoCashout: boolean;
  autoCashoutValue: number;
}
