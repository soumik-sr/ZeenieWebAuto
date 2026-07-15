import React, { useState, useEffect } from 'react';
import { 
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, 
  Crown, RefreshCw, Volume2, VolumeX, LogOut, ChevronRight, CheckCircle2 
} from 'lucide-react';
import './LudoBoard.css';

// ==========================================
// 1. BOARD COORDINATES & PATH DEFINITIONS
// ==========================================

// 15x15 Ludo Grid:
// Top-Left Home Base: [0..5] x [0..5]
// Top-Right Home Base: [0..5] x [9..14]
// Bottom-Left Home Base: [9..14] x [0..5]
// Bottom-Right Home Base: [9..14] x [9..14]
// Central Triangle (Home Domain): [6..8] x [6..8]

// Standard Ludo track mapping for standard 15x15 board.
// We map the common track sequence of 52 cells that wraps around the board.
// Index 0 in this track starts at cell (6, 1) - Red's starting threshold.
const TRACK_COORDINATES = [
  { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 }, // Red track left upper
  { r: 5, c: 6 }, { r: 4, c: 6 }, { r: 3, c: 6 }, { r: 2, c: 6 }, { r: 1, c: 6 }, { r: 0, c: 6 }, // Top track left
  { r: 0, c: 7 }, // Top center cross (safe zone / start for green)
  { r: 0, c: 8 }, { r: 1, c: 8 }, { r: 2, c: 8 }, { r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 }, // Top track right
  { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 }, { r: 6, c: 13 }, { r: 6, c: 14 }, // Right track upper
  { r: 7, c: 14 }, // Right center cross (safe zone / start for yellow)
  { r: 8, c: 14 }, { r: 8, c: 13 }, { r: 8, c: 12 }, { r: 8, c: 11 }, { r: 8, c: 10 }, { r: 8, c: 9 }, // Right track lower
  { r: 9, c: 8 }, { r: 10, c: 8 }, { r: 11, c: 8 }, { r: 12, c: 8 }, { r: 13, c: 8 }, { r: 14, c: 8 }, // Bottom track right
  { r: 14, c: 7 }, // Bottom center cross (safe zone / start for blue)
  { r: 14, c: 6 }, { r: 13, c: 6 }, { r: 12, c: 6 }, { r: 11, c: 6 }, { r: 10, c: 6 }, { r: 9, c: 6 }, // Bottom track left
  { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 }, { r: 8, c: 1 }, { r: 8, c: 0 }, // Left track lower
  { r: 7, c: 0 }, // Left center cross (safe zone / start for red)
  { r: 6, c: 0 }  // Left track upper start-loop connector
];

// Safe zones are specific indices on the 52-cell track where tokens cannot be captured.
// Standard safe zones: Red start (51), Green start (12), Yellow start (25), Blue start (38)
// plus the star safe zones: index 8, 21, 34, 47.
const SAFE_CELL_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

// Home Path coordinates for each player leading to the center triangle.
const HOME_PATHS = {
  red: [
    { r: 7, c: 1 }, { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, { r: 7, c: 5 }
  ],
  green: [
    { r: 1, c: 7 }, { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, { r: 5, c: 7 }
  ],
  yellow: [
    { r: 7, c: 13 }, { r: 7, c: 12 }, { r: 7, c: 11 }, { r: 7, c: 10 }, { r: 7, c: 9 }
  ],
  blue: [
    { r: 13, c: 7 }, { r: 12, c: 7 }, { r: 11, c: 7 }, { r: 10, c: 7 }, { r: 9, c: 7 }
  ]
};

// Start track index on the 52-cell track for each color
const START_INDICES = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

// Home Base coordinates to draw tokens inside their respective safe villas
const HOME_BASE_COORDINATES = {
  red: [
    { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 3, c: 2 }, { r: 3, c: 3 }
  ],
  green: [
    { r: 2, c: 11 }, { r: 2, c: 12 }, { r: 3, c: 11 }, { r: 3, c: 12 }
  ],
  yellow: [
    { r: 11, c: 11 }, { r: 11, c: 12 }, { r: 12, c: 11 }, { r: 12, c: 12 }
  ],
  blue: [
    { r: 11, c: 2 }, { r: 11, c: 3 }, { r: 12, c: 2 }, { r: 12, c: 3 }
  ]
};

const PLAYER_COLORS = ['red', 'green', 'yellow', 'blue'];

export default function LudoBoard({ players, onReset }) {
  // ==========================================
  // 2. STATE INITIALIZATION
  // ==========================================
  
  // Game turns and dice
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  
  // Tokens state: each player has 4 tokens
  // status: 'home' (inside villa), 'track' (on the common path), 'homepath' (on the colored final stretch), 'completed' (reached center goal)
  // position: 
  //   - if 'home': index (0..3) representing their spot in the villa
  //   - if 'track': index (0..51) on the TRACK_COORDINATES array
  //   - if 'homepath': index (0..4) on their respective HOME_PATHS array
  //   - if 'completed': constant/final value
  const [tokens, setTokens] = useState({
    red: [
      { id: 0, status: 'home', position: 0 },
      { id: 1, status: 'home', position: 1 },
      { id: 2, status: 'home', position: 2 },
      { id: 3, status: 'home', position: 3 }
    ],
    green: [
      { id: 0, status: 'home', position: 0 },
      { id: 1, status: 'home', position: 1 },
      { id: 2, status: 'home', position: 2 },
      { id: 3, status: 'home', position: 3 }
    ],
    yellow: [
      { id: 0, status: 'home', position: 0 },
      { id: 1, status: 'home', position: 1 },
      { id: 2, status: 'home', position: 2 },
      { id: 3, status: 'home', position: 3 }
    ],
    blue: [
      { id: 0, status: 'home', position: 0 },
      { id: 1, status: 'home', position: 1 },
      { id: 2, status: 'home', position: 2 },
      { id: 3, status: 'home', position: 3 }
    ]
  });

  // Log and sound settings
  const [logs, setLogs] = useState([
    { text: 'The grand mind board is set. Aurelia starts the match.', type: 'system' }
  ]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [winner, setWinner] = useState(null);

  const activeColor = PLAYER_COLORS[currentPlayerIdx];
  const activePlayerName = players[currentPlayerIdx].name;

  // ==========================================
  // 3. SOUND EFFECTS (SYNTHESIZED WEB AUDIO API)
  // ==========================================
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'roll') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'move') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        osc.frequency.setValueAtTime(440, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'capture') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'spawn') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
        osc.frequency.setValueAtTime(329.63, ctx.currentTime + 0.1); // E4
        osc.frequency.setValueAtTime(392.00, ctx.currentTime + 0.2); // G4
        osc.frequency.setValueAtTime(523.25, ctx.currentTime + 0.3); // C5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'victory') {
        osc.type = 'sine';
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscNode.type = 'sine';
          oscNode.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
          oscNode.connect(gainNode);
          gainNode.connect(ctx.destination);
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.12);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.12 + 0.4);
          oscNode.start(ctx.currentTime + idx * 0.12);
          oscNode.stop(ctx.currentTime + idx * 0.12 + 0.4);
        });
      }
    } catch (e) {
      console.warn('Audio context blocked or unsupported:', e);
    }
  };

  // ==========================================
  // 4. CORE LUDO LOGIC & STATE MACHINE
  // ==========================================

  const addLog = (text, type = 'info') => {
    setLogs((prev) => [{ text, type }, ...prev].slice(0, 30));
  };

  // Roll Dice Action
  const rollDice = () => {
    if (isRolling || hasRolled || winner) return;

    setIsRolling(true);
    playSound('roll');
    
    // Simulate luxury rolling vibration
    let rollsCount = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollsCount++;
      if (rollsCount > 8) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);
        setHasRolled(true);
        evaluateTurn(finalValue);
      }
    }, 60);
  };

  // Evaluate if the current player has any valid moves
  const evaluateTurn = (rollVal) => {
    const activeTokens = tokens[activeColor];
    const playableTokens = activeTokens.filter(token => canMoveToken(token, rollVal));

    if (playableTokens.length === 0) {
      addLog(`${activePlayerName} rolled a ${rollVal} but has no available moves.`, 'warning');
      // Auto-pass turn after a short graceful delay
      setTimeout(() => {
        passTurn();
      }, 1500);
    } else {
      addLog(`${activePlayerName} rolled a ${rollVal}. Select a token to move.`, 'info');
    }
  };

  // Check if a specific token is legally allowed to move with the rolled value
  const canMoveToken = (token, rollVal) => {
    if (token.status === 'completed') return false;

    // To move out of home base, player needs a 6
    if (token.status === 'home') {
      return rollVal === 6;
    }

    // On home path, must land exactly on index 5 (which is completion)
    if (token.status === 'homepath') {
      return token.position + rollVal <= 5;
    }

    // On normal track, it can always move
    return true;
  };

  // Pass turn to the next player
  const passTurn = () => {
    setHasRolled(false);
    setCurrentPlayerIdx((prev) => (prev + 1) % 4);
  };

  // Move token step-by-step to create smooth, visually beautiful state transitions
  const moveToken = async (tokenId) => {
    if (!hasRolled || isRolling || winner) return;

    const token = tokens[activeColor].find(t => t.id === tokenId);
    if (!token || !canMoveToken(token, diceValue)) return;

    const steps = diceValue;
    let currentStatus = token.status;
    let currentPos = token.position;

    // Handle Spawning (Moving from home base to track)
    if (currentStatus === 'home') {
      playSound('spawn');
      const startPos = START_INDICES[activeColor];
      
      setTokens(prev => {
        const updated = { ...prev };
        updated[activeColor] = updated[activeColor].map(t => 
          t.id === tokenId ? { ...t, status: 'track', position: startPos } : t
        );
        return updated;
      });

      addLog(`${activePlayerName} summoned a token into the field!`, 'success');
      
      // If player rolls a 6, they get another turn in standard Ludo!
      if (diceValue === 6) {
        addLog(`${activePlayerName} gets an extra roll for a noble 6!`, 'success');
        setHasRolled(false);
      } else {
        passTurn();
      }
      return;
    }

    // Step-by-step movement animation simulation
    for (let step = 1; step <= steps; step++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      playSound('move');

      if (currentStatus === 'track') {
        // Calculate next position
        const nextPos = (currentPos + 1) % 52;
        
        // Check if token has completed a full loop and should enter homepath
        const startPos = START_INDICES[activeColor];
        // The threshold to enter the homepath is 51 steps from start position.
        // We can check if we have reached the cell just before our starting cell.
        const homePathEntrancePos = (startPos - 1 + 52) % 52;

        if (currentPos === homePathEntrancePos) {
          currentStatus = 'homepath';
          currentPos = 0;
        } else {
          currentPos = nextPos;
        }
      } else if (currentStatus === 'homepath') {
        currentPos += 1;
        if (currentPos === 5) {
          currentStatus = 'completed';
        }
      }

      // Update intermediate state for visual rendering
      setTokens(prev => {
        const updated = { ...prev };
        updated[activeColor] = updated[activeColor].map(t => 
          t.id === tokenId ? { ...t, status: currentStatus, position: currentPos } : t
        );
        return updated;
      });
    }

    // Handle landing logic (Completion, Captures, Safe Zones)
    if (currentStatus === 'completed') {
      addLog(`Magnificent! One of ${activePlayerName}'s tokens reached the center domain!`, 'success');
      checkVictory();
    } else if (currentStatus === 'track') {
      // Check for capture opportunities
      handleCaptures(currentPos);
    }

    // Give another turn on a 6, otherwise pass turn
    if (diceValue === 6 && currentStatus !== 'completed') {
      addLog(`${activePlayerName} gets another turn for rolling a 6!`, 'success');
      setHasRolled(false);
    } else {
      passTurn();
    }
  };

  // Check for opponent tokens on the same cell and capture them if not on a safe zone
  const handleCaptures = (landedTrackPos) => {
    // If landed cell is a safe zone star/threshold, capture is blocked
    if (SAFE_CELL_INDICES.includes(landedTrackPos)) {
      return;
    }

    let capturedAny = false;

    // Loop through all other players
    PLAYER_COLORS.forEach(color => {
      if (color === activeColor) return;

      tokens[color].forEach(oppToken => {
        if (oppToken.status === 'track' && oppToken.position === landedTrackPos) {
          // Capture! Send back home
          capturedAny = true;
          playSound('capture');
          
          // Find first available home slot index (0..3)
          const homeSlot = oppToken.id;

          setTokens(prev => {
            const updated = { ...prev };
            updated[color] = updated[color].map(t => 
              t.id === oppToken.id ? { ...t, status: 'home', position: homeSlot } : t
            );
            return updated;
          });

          const opponentName = players[PLAYER_COLORS.indexOf(color)].name;
          addLog(`Noble capture! ${activePlayerName} sent ${opponentName}'s token back to their villa.`, 'capture');
        }
      });
    });

    // Award bonus turn for capturing
    if (capturedAny) {
      addLog(`${activePlayerName} earns a bonus roll for a successful capture!`, 'success');
      setHasRolled(false);
    }
  };

  // Check if active player has won (all 4 tokens completed)
  const checkVictory = () => {
    const activeTokens = tokens[activeColor];
    const allCompleted = activeTokens.every(t => t.status === 'completed');
    
    if (allCompleted) {
      setWinner(players[currentPlayerIdx]);
      playSound('victory');
      addLog(`👑 ALL HAIL ${activePlayerName}! The ultimate champion of Lumina Ludo!`, 'victory');
    }
  };

  // Reset current game
  const resetGame = () => {
    setTokens({
      red: [{ id: 0, status: 'home', position: 0 }, { id: 1, status: 'home', position: 1 }, { id: 2, status: 'home', position: 2 }, { id: 3, status: 'home', position: 3 }],
      green: [{ id: 0, status: 'home', position: 0 }, { id: 1, status: 'home', position: 1 }, { id: 2, status: 'home', position: 2 }, { id: 3, status: 'home', position: 3 }],
      yellow: [{ id: 0, status: 'home', position: 0 }, { id: 1, status: 'home', position: 1 }, { id: 2, status: 'home', position: 2 }, { id: 3, status: 'home', position: 3 }],
      blue: [{ id: 0, status: 'home', position: 0 }, { id: 1, status: 'home', position: 1 }, { id: 2, status: 'home', position: 2 }, { id: 3, status: 'home', position: 3 }]
    });
    setCurrentPlayerIdx(0);
    setDiceValue(1);
    setIsRolling(false);
    setHasRolled(false);
    setWinner(null);
    setLogs([{ text: 'The board is restored. Let the mind game commence.', type: 'system' }]);
  };

  // ==========================================
  // 5. GRID RENDERING & TOKEN PLACEMENT
  // ==========================================

  // Returns array of tokens currently residing on a specific (row, col) cell
  const getTokensAtCell = (row, col) => {
    const found = [];
    PLAYER_COLORS.forEach(color => {
      tokens[color].forEach(token => {
        let tokenCoords = null;
        
        if (token.status === 'home') {
          tokenCoords = HOME_BASE_COORDINATES[color][token.position];
        } else if (token.status === 'track') {
          tokenCoords = TRACK_COORDINATES[token.position];
        } else if (token.status === 'homepath') {
          tokenCoords = HOME_PATHS[color][token.position];
        }

        if (tokenCoords && tokenCoords.r === row && tokenCoords.c === col) {
          found.push({ ...token, color });
        }
      });
    });
    return found;
  };

  // Render cells in Ludo's 15x15 grid
  const renderGridCells = () => {
    const cells = [];
    
    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        // Determine cell types for custom luxury styles
        let cellClass = 'ludo-cell';
        let specialIcon = null;

        // Home Bases / Villas
        if (r < 6 && c < 6) cellClass += ' home-red';
        else if (r < 6 && c >= 9) cellClass += ' home-green';
        else if (r >= 9 && c >= 9) cellClass += ' home-yellow';
        else if (r >= 9 && c < 6) cellClass += ' home-blue';
        
        // Center Domain (Home Goal)
        else if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
          cellClass += ' center-domain';
        }
        
        // Paths & Tracks
        else {
          // Color-coded Home path cells
          if (r === 7 && c >= 1 && c <= 5) cellClass += ' path-red-light';
          else if (c === 7 && r >= 1 && r <= 5) cellClass += ' path-green-light';
          else if (r === 7 && c >= 9 && c <= 13) cellClass += ' path-yellow-light';
          else if (c === 7 && r >= 9 && r <= 13) cellClass += ' path-blue-light';
          
          // Specific starting threshold cells
          else if (r === 6 && c === 1) cellClass += ' start-red';
          else if (r === 1 && c === 8) cellClass += ' start-green';
          else if (r === 8 && c === 13) cellClass += ' start-yellow';
          else if (r === 13 && c === 6) cellClass += ' start-blue';

          // Safe zone star cells
          const trackIdx = TRACK_COORDINATES.findIndex(coord => coord.r === r && coord.c === c);
          if (trackIdx !== -1 && SAFE_CELL_INDICES.includes(trackIdx)) {
            cellClass += ' safe-star';
            specialIcon = '✦';
          }
        }

        // Get tokens on this cell
        const cellTokens = getTokensAtCell(r, c);

        cells.push(
          <div 
            key={`${r}-${c}`} 
            className={`${cellClass}`}
            style={{ gridRowStart: r + 1, gridColumnStart: c + 1 }}
          >
            {specialIcon && <span className="star-icon">{specialIcon}</span>}
            
            {/* Render tokens on this cell */}
            {cellTokens.length > 0 && (
              <div className={`tokens-container count-${cellTokens.length}`}>
                {cellTokens.map((token) => {
                  const isTokenActiveColor = token.color === activeColor;
                  const canMove = hasRolled && isTokenActiveColor && canMoveToken(token, diceValue);
                  
                  return (
                    <button
                      key={`${token.color}-${token.id}`}
                      className={`ludo-token token-${token.color} ${canMove ? 'token-playable' : ''}`}
                      disabled={!canMove}
                      onClick={() => moveToken(token.id)}
                      title={`${token.color.toUpperCase()} Token ${token.id + 1}`}
                    >
                      <span className="token-inner"></span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  // Get Dice Icon based on value
  const renderDiceIcon = () => {
    const props = { size: 48, className: `dice-svg ${isRolling ? 'rolling' : ''}` };
    switch (diceValue) {
      case 1: return <Dice1 {...props} />;
      case 2: return <Dice2 {...props} />;
      case 3: return <Dice3 {...props} />;
      case 4: return <Dice4 {...props} />;
      case 5: return <Dice5 {...props} />;
      case 6: return <Dice6 {...props} />;
      default: return <Dice6 {...props} />;
    }
  };

  return (
    <div className="ludo-board-wrapper">
      {/* Dynamic Turn Indicator & Scoreboard */}
      <div className="scoreboard-panel glass-panel">
        <div className="player-turns-list">
          {players.map((p, idx) => {
            const isCurrent = idx === currentPlayerIdx;
            const completedCount = tokens[p.color].filter(t => t.status === 'completed').length;
            
            return (
              <div 
                key={p.id} 
                className={`player-turn-card card-${p.color} ${isCurrent ? 'active-turn' : ''}`}
              >
                <div className="turn-card-header">
                  <span className="turn-dot" style={{ backgroundColor: p.colorHex }}></span>
                  <span className="turn-name">{p.name}</span>
                </div>
                <div className="turn-card-stats">
                  <span className="completed-badge">
                    <Crown size={12} className="crown-icon" />
                    <span>{completedCount}/4 Done</span>
                  </span>
                </div>
                {isCurrent && <div className="active-pulse-ring"></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Board Arena */}
      <div className="board-arena">
        <div className="ludo-grid-container glass-panel">
          {renderGridCells()}

          {/* Elegant Home Villa Labels inside board */}
          <div className="villa-label label-red">
            <span className="villa-crest">⚜️</span>
            <span>{players[0].name}</span>
          </div>
          <div className="villa-label label-green">
            <span className="villa-crest">⚜️</span>
            <span>{players[1].name}</span>
          </div>
          <div className="villa-label label-yellow">
            <span className="villa-crest">⚜️</span>
            <span>{players[2].name}</span>
          </div>
          <div className="villa-label label-blue">
            <span className="villa-crest">⚜️</span>
            <span>{players[3].name}</span>
          </div>
        </div>

        {/* Dice Control and Log Station */}
        <div className="control-station glass-panel">
          <div className="dice-container-box">
            <div className="dice-glow-ring" style={{ borderColor: `var(--color-${activeColor})` }} />
            <div className="dice-display">
              {renderDiceIcon()}
            </div>
            
            <div className="dice-action-details">
              <p className="active-player-announcement">
                <span className="player-color-caps" style={{ color: `var(--color-${activeColor})` }}>
                  {activePlayerName}
                </span>
                's Turn
              </p>
              
              <button 
                className={`roll-button btn-${activeColor}`}
                disabled={isRolling || hasRolled || winner !== null}
                onClick={rollDice}
              >
                {isRolling ? 'ROLLING...' : hasRolled ? 'CHOOSE TOKEN' : 'ROLL DICE'}
              </button>
            </div>
          </div>

          {/* Sound & Controls */}
          <div className="utility-bar">
            <button className="sound-toggle-btn" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{soundEnabled ? 'Mute' : 'Unmute'}</span>
            </button>
            <button className="restart-game-btn" onClick={resetGame}>
              <RefreshCw size={14} />
              <span>Restart</span>
            </button>
          </div>

          {/* Realtime Rolling Log Feed */}
          <div className="log-panel">
            <h4 className="log-panel-title">Mind Board Chronicle</h4>
            <div className="log-list">
              {logs.map((log, idx) => (
                <div key={idx} className={`log-entry entry-${log.type}`}>
                  <ChevronRight size={12} className="log-arrow" />
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Victory Modal */}
      {winner && (
        <div className="victory-modal-overlay">
          <div className="victory-modal glass-panel-dark">
            <Crown size={64} className="gold-crown-victory" />
            <h2 className="victory-title">A Masterful Victory</h2>
            <p className="victory-subtitle">The mind board has recognized its sovereign champion.</p>
            
            <div className="winner-announcement-card">
              <span className="winner-dot" style={{ backgroundColor: winner.colorHex }}></span>
              <h3 className="winner-name">{winner.name}</h3>
              <p className="winner-color-tag">{winner.color.toUpperCase()} KINGDOM</p>
            </div>

            <div className="victory-actions">
              <button className="modal-restart-btn" onClick={resetGame}>
                <RefreshCw size={16} />
                <span>Play Another Match</span>
              </button>
              <button className="modal-exit-btn" onClick={onReset}>
                <LogOut size={16} />
                <span>Exit Arena</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
