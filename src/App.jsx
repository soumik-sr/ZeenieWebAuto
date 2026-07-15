import React, { useState } from 'react';
import LudoBoard from './components/LudoBoard';
import { Sparkles, Trophy, Users, RefreshCw, Dice5, ShieldAlert } from 'lucide-react';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('landing'); // 'landing' | 'playing'
  const [players, setPlayers] = useState([
    { id: 0, name: 'Aurelia', color: 'red', colorHex: 'var(--color-red)' },
    { id: 1, name: 'Valerius', color: 'green', colorHex: 'var(--color-green)' },
    { id: 2, name: 'Octavia', color: 'yellow', colorHex: 'var(--color-yellow)' },
    { id: 3, name: 'Lysander', color: 'blue', colorHex: 'var(--color-blue)' }
  ]);

  const handlePlayerNameChange = (index, newName) => {
    const updated = [...players];
    updated[index].name = newName || `Player ${index + 1}`;
    setPlayers(updated);
  };

  const startGame = () => {
    setGameState('playing');
  };

  const resetToLanding = () => {
    setGameState('landing');
  };

  return (
    <div className="app-container">
      {/* Elegant Header Background Element */}
      <div className="luxury-header-accent" />

      {gameState === 'landing' ? (
        <div className="landing-screen">
          <div className="landing-card glass-panel">
            <div className="luxury-crest">
              <Sparkles size={28} className="crest-icon" />
            </div>
            
            <h1 className="landing-title">Lumina Ludo</h1>
            <p className="landing-subtitle">An Elegant Mind Board Experience</p>
            
            <div className="divider-gold">
              <span className="divider-dot"></span>
              <span className="divider-line"></span>
              <span className="divider-dot"></span>
            </div>

            <p className="setup-instructions">
              Enter the names of the noble contenders who will claim the safe paths and conquer the center domain.
            </p>

            <div className="players-setup-grid">
              {players.map((player, idx) => (
                <div key={player.id} className={`player-setup-card setup-${player.color}`}>
                  <div className="player-indicator-tag">
                    <span className="color-dot" style={{ backgroundColor: player.colorHex }}></span>
                    <span className="color-name">{player.color.toUpperCase()}</span>
                  </div>
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handlePlayerNameChange(idx, e.target.value)}
                    placeholder={`Player ${idx + 1}`}
                    maxLength={15}
                    className="player-name-input"
                  />
                </div>
              ))}
            </div>

            <button className="start-game-btn" onClick={startGame}>
              <span>ENTER THE ARENA</span>
              <Trophy size={18} className="btn-icon" />
            </button>

            <div className="rule-hints">
              <div className="hint-item">
                <Dice5 size={14} className="hint-icon" />
                <span>Roll a <b>6</b> to summon a token from your home villa.</span>
              </div>
              <div className="hint-item">
                <ShieldAlert size={14} className="hint-icon" />
                <span>Safe zones (marked with elegant star medallions) shield you from captures.</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="game-screen">
          <header className="game-header glass-panel">
            <div className="header-brand">
              <span className="header-crest">⚜️</span>
              <div>
                <h2 className="header-title">Lumina Ludo</h2>
                <p className="header-subtitle">Elegant Mind Board</p>
              </div>
            </div>

            <button className="reset-btn" onClick={resetToLanding}>
              <RefreshCw size={14} />
              <span>Reset Board</span>
            </button>
          </header>

          <main className="game-layout">
            <LudoBoard players={players} onReset={resetToLanding} />
          </main>
        </div>
      )}

      <footer className="elegant-footer">
        <p>© LUMINA LUDO // A Symphony of Pure Strategy & Muted Pastel Aesthetics</p>
      </footer>
    </div>
  );
}

export default App;
