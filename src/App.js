import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [flipCount, setFlipCount] = useState(0);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [particles, setParticles] = useState([]);
  const [streak, setStreak] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [showSparkles, setShowSparkles] = useState(false);
  const audioRef = useRef(null);

  // Create confetti particles
  const createConfetti = () => {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    const newParticles = [];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
    setParticles(newParticles);
  };

  // Create sparkle effect
  const createSparkles = () => {
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1000);
  };

  const flipCoin = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setResult(null);
    setShowConfetti(false);
    
    // Create sparkle effect on button click
    createSparkles();
    
    // Simulate coin flipping animation
    setTimeout(() => {
      const randomResult = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(randomResult);
      setIsFlipping(false);
      setFlipCount(prev => prev + 1);
      
      // Update streak
      if (randomResult === lastResult) {
        setStreak(prev => prev + 1);
      } else {
        setStreak(1);
      }
      setLastResult(randomResult);
      
      if (randomResult === 'heads') {
        setHeadsCount(prev => prev + 1);
      } else {
        setTailsCount(prev => prev + 1);
      }
      
      // Show confetti for streaks
      if (streak >= 3) {
        setShowConfetti(true);
        createConfetti();
      }
      
      // Play sound effect (if available)
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
    }, 1000);
  };

  const resetStats = () => {
    setFlipCount(0);
    setHeadsCount(0);
    setTailsCount(0);
    setResult(null);
    setStreak(0);
    setLastResult(null);
    setShowConfetti(false);
    setParticles([]);
  };

  // Animate particles
  useEffect(() => {
    if (particles.length > 0) {
      const interval = setInterval(() => {
        setParticles(prev => 
          prev.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            rotation: particle.rotation + particle.rotationSpeed,
            vy: particle.vy + 0.1 // gravity
          })).filter(particle => particle.y < window.innerHeight + 100)
        );
      }, 16);
      
      return () => clearInterval(interval);
    }
  }, [particles]);

  return (
    <div className="App">
      {/* Background particles */}
      <div className="background-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bg-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }} />
        ))}
      </div>

      {/* Confetti */}
      {showConfetti && particles.map(particle => (
        <div
          key={particle.id}
          className="confetti-piece"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            transform: `rotate(${particle.rotation}deg)`
          }}
        />
      ))}

      {/* Sparkles */}
      {showSparkles && (
        <div className="sparkles">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="sparkle" style={{
              '--angle': `${i * 30}deg`,
              '--delay': `${i * 0.1}s`
            }} />
          ))}
        </div>
      )}

      <div className="container">
        <h1 className="title">
          <span className="title-icon">🪙</span>
          <span className="title-text">Coin Flip App</span>
          <span className="title-icon">🪙</span>
        </h1>
        
        {/* Streak display */}
        {streak > 1 && (
          <div className="streak-display">
            🔥 {streak} in a row! 🔥
          </div>
        )}
        
        <div className="coin-container">
          <div className={`coin ${isFlipping ? 'flipping' : ''} ${result}`}>
            <div className="coin-side heads">
              <span>H</span>
              <div className="coin-shine"></div>
            </div>
            <div className="coin-side tails">
              <span>T</span>
              <div className="coin-shine"></div>
            </div>
          </div>
        </div>

        <div className="result-display">
          {isFlipping && (
            <div className="flipping-container">
              <p className="flipping-text">Flipping...</p>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          {result && !isFlipping && (
            <div className={`result-container ${result}`}>
              <p className={`result-text ${result}`}>
                {result === 'heads' ? '🪙 Heads!' : '🪙 Tails!'}
              </p>
              <div className="result-sparkles">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="result-sparkle" style={{
                    '--delay': `${i * 0.1}s`
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          className={`flip-button ${isFlipping ? 'disabled' : ''}`}
          onClick={flipCoin}
          disabled={isFlipping}
        >
          <span className="button-text">
            {isFlipping ? 'Flipping...' : 'Flip Coin'}
          </span>
          <div className="button-glow"></div>
        </button>

        <div className="stats">
          <h3>📊 Statistics</h3>
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
          <span>🔄 Reset Statistics</span>
        </button>
      </div>

      {/* Hidden audio element for sound effects */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav" />
      </audio>
    </div>
  );
}

export default App; 