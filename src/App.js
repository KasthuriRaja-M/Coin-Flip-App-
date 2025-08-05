import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [flipCount, setFlipCount] = useState(0);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);

  const flipCoin = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setResult(null);
    
    // Simulate coin flipping animation
    setTimeout(() => {
      const randomResult = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(randomResult);
      setIsFlipping(false);
      setFlipCount(prev => prev + 1);
      
      if (randomResult === 'heads') {
        setHeadsCount(prev => prev + 1);
      } else {
        setTailsCount(prev => prev + 1);
      }
    }, 1000);
  };

  const resetStats = () => {
    setFlipCount(0);
    setHeadsCount(0);
    setTailsCount(0);
    setResult(null);
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">🪙 Coin Flip App</h1>
        
        <div className="coin-container">
          <div className={`coin ${isFlipping ? 'flipping' : ''} ${result}`}>
            <div className="coin-side heads">
              <span>H</span>
            </div>
            <div className="coin-side tails">
              <span>T</span>
            </div>
          </div>
        </div>

        <div className="result-display">
          {isFlipping && <p className="flipping-text">Flipping...</p>}
          {result && !isFlipping && (
            <p className={`result-text ${result}`}>
              {result === 'heads' ? '🪙 Heads!' : '🪙 Tails!'}
            </p>
          )}
        </div>

        <button 
          className={`flip-button ${isFlipping ? 'disabled' : ''}`}
          onClick={flipCoin}
          disabled={isFlipping}
        >
          {isFlipping ? 'Flipping...' : 'Flip Coin'}
        </button>

        <div className="stats">
          <h3>Statistics</h3>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-label">Total Flips:</span>
              <span className="stat-value">{flipCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Heads:</span>
              <span className="stat-value heads">{headsCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tails:</span>
              <span className="stat-value tails">{tailsCount}</span>
            </div>
          </div>
          
          {flipCount > 0 && (
            <div className="percentages">
              <div className="percentage-item">
                <span>Heads: {((headsCount / flipCount) * 100).toFixed(1)}%</span>
              </div>
              <div className="percentage-item">
                <span>Tails: {((tailsCount / flipCount) * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>

        <button className="reset-button" onClick={resetStats}>
          Reset Statistics
        </button>
      </div>
    </div>
  );
}

export default App; 