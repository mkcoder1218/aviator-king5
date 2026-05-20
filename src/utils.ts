import { PlayerBet } from './types';

// Preset lists for simulated bots
const FIRST_LETTERS = ['d', 'b', 'g', 'a', 'm', 's', 'p', 'l', 'k', 'r', 'y', 't', 'x', 'z', 'h', 'c', 'f', 'v', 'w', 'j'];
const ENDS = ['9', '1', '5', '0', '6', '7', '2', '3', '8', '4'];
const AVATAR_COLORS = [
  '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', 
  '#2563eb', '#4f46e5', '#7c3aed', '#db2777', '#c026d3',
  '#059669', '#10b981', '#0d9488', '#2563eb', '#4338ca'
];

export function generateUsername(): string {
  const start = FIRST_LETTERS[Math.floor(Math.random() * FIRST_LETTERS.length)];
  const end = ENDS[Math.floor(Math.random() * ENDS.length)];
  return `${start}***${end}`;
}

export function generateInitials(username: string): string {
  if (username.length > 0) {
    return username[0].toUpperCase();
  }
  return 'U';
}

export function generateBots(count: number): PlayerBet[] {
  const bots: PlayerBet[] = [];
  for (let i = 0; i < count; i++) {
    const username = generateUsername();
    // typical bet sizes in USD
    const betSizes = [1, 2, 5, 10, 20, 50, 100, 200];
    const betWeights = [0.15, 0.2, 0.25, 0.2, 0.1, 0.05, 0.03, 0.02];
    
    // Weighted selection
    let r = Math.random();
    let index = 0;
    let accum = 0;
    for (let w = 0; w < betWeights.length; w++) {
      accum += betWeights[w];
      if (r <= accum) {
        index = w;
        break;
      }
    }
    const betAmount = betSizes[index];
    
    // Choose random pre-determined cashout multiplier for bot simulation
    // Some cashout early, some late, some never cash out (climb past crash)
    let cashoutTarget = 1.05 + Math.pow(Math.random(), 2.2) * 5; // typical bot cashout between 1.05 and 6.00
    if (Math.random() < 0.15) {
      cashoutTarget = 1.05 + Math.random() * 0.4; // 15% cashout very early
    } else if (Math.random() < 0.08) {
      cashoutTarget = 6.0 + Math.random() * 20; // 8% cashout high
    }
    
    // Ensure decimal output
    cashoutTarget = Math.round(cashoutTarget * 100) / 100;

    bots.push({
      id: `bot_${Math.random().toString(36).substr(2, 9)}`,
      username,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      avatarInitials: generateInitials(username),
      betAmount,
      cashoutTarget,
      isCashedOut: false,
    });
  }
  return bots;
}

export function generateCrashPoint(): number {
  const rand = Math.random();
  // 3.5% chance of instant crash at 1.00x
  if (rand < 0.035) {
    return 1.00;
  }
  
  // Aviator probability model simulation
  // We use standard inverse transform to map a random uniform value into crash curve
  // Resulting in standard house edge of ~3%
  const multiplier = 0.98 / (1.0 - rand * 0.95);
  const crashVal = Math.max(1.01, Math.round(multiplier * 100) / 100);
  
  // Add rare crazy multipliers
  if (crashVal > 15 && Math.random() < 0.1) {
    return Math.round((crashVal * (2 + Math.random() * 8)) * 100) / 100;
  }
  
  return crashVal;
}

export function getMultiplierColor(multiplier: number): string {
  if (multiplier < 2.00) {
    return '#419af9'; // Blue Text
  } else if (multiplier < 10.00) {
    return '#913df2'; // Purple Text
  } else {
    return '#c2185b'; // Intense Magenta/Red for high wins
  }
}

export function getMultiplierBgColor(multiplier: number): string {
  if (multiplier < 2.00) {
    return 'rgba(65, 154, 249, 0.15)'; 
  } else if (multiplier < 10.00) {
    return 'rgba(145, 61, 242, 0.15)'; 
  } else {
    return 'rgba(194, 24, 91, 0.15)'; 
  }
}

export function getMultiplierBorderColor(multiplier: number): string {
  if (multiplier < 2.00) {
    return 'rgba(65, 154, 249, 0.3)'; 
  } else if (multiplier < 10.00) {
    return 'rgba(145, 61, 242, 0.3)'; 
  } else {
    return 'rgba(194, 24, 91, 0.3)'; 
  }
}
