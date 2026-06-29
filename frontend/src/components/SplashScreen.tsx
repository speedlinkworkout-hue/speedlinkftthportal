import React, { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Loader (converted to use standard CSS to remove styled-components dependency)
// ---------------------------------------------------------------------------
const Loader = () => {
  return (
    <>
      <style>{`
        .splash-loader-wrapper {
          position: relative;
          width: 75px;
          height: 100px;
        }

        .splash-loader__bar {
          position: absolute;
          bottom: 0;
          width: 10px;
          height: 50%;
          background: rgb(0, 0, 0);
          transform-origin: center bottom;
          box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
        }

        .splash-loader__bar:nth-child(1) {
          left: 0px;
          transform: scale(1, 0.2);
          animation: barUp1 4s infinite;
        }

        .splash-loader__bar:nth-child(2) {
          left: 15px;
          transform: scale(1, 0.4);
          animation: barUp2 4s infinite;
        }

        .splash-loader__bar:nth-child(3) {
          left: 30px;
          transform: scale(1, 0.6);
          animation: barUp3 4s infinite;
        }

        .splash-loader__bar:nth-child(4) {
          left: 45px;
          transform: scale(1, 0.8);
          animation: barUp4 4s infinite;
        }

        .splash-loader__bar:nth-child(5) {
          left: 60px;
          transform: scale(1, 1);
          animation: barUp5 4s infinite;
        }

        .splash-loader__ball {
          position: absolute;
          bottom: 10px;
          left: 0;
          width: 10px;
          height: 10px;
          background: rgb(44, 143, 255);
          border-radius: 50%;
          animation: ball624 4s infinite;
        }

        @keyframes ball624 {
          0% { transform: translate(0, 0); }
          5% { transform: translate(8px, -14px); }
          10% { transform: translate(15px, -10px); }
          17% { transform: translate(23px, -24px); }
          20% { transform: translate(30px, -20px); }
          27% { transform: translate(38px, -34px); }
          30% { transform: translate(45px, -30px); }
          37% { transform: translate(53px, -44px); }
          40% { transform: translate(60px, -40px); }
          50% { transform: translate(60px, 0); }
          57% { transform: translate(53px, -14px); }
          60% { transform: translate(45px, -10px); }
          67% { transform: translate(37px, -24px); }
          70% { transform: translate(30px, -20px); }
          77% { transform: translate(22px, -34px); }
          80% { transform: translate(15px, -30px); }
          87% { transform: translate(7px, -44px); }
          90% { transform: translate(0, -40px); }
          100% { transform: translate(0, 0); }
        }

        @keyframes barUp1 {
          0%, 40%, 100% { transform: scale(1, 0.2); }
          50%, 90% { transform: scale(1, 1); }
        }

        @keyframes barUp2 {
          0%, 40%, 100% { transform: scale(1, 0.4); }
          50%, 90% { transform: scale(1, 0.8); }
        }

        @keyframes barUp3 {
          0%, 100% { transform: scale(1, 0.6); }
        }

        @keyframes barUp4 {
          0%, 40%, 100% { transform: scale(1, 0.8); }
          50%, 90% { transform: scale(1, 0.4); }
        }

        @keyframes barUp5 {
          0%, 40%, 100% { transform: scale(1, 1); }
          50%, 90% { transform: scale(1, 0.2); }
        }
      `}</style>
      <div className="splash-loader-wrapper">
        <div className="splash-loader__bar" />
        <div className="splash-loader__bar" />
        <div className="splash-loader__bar" />
        <div className="splash-loader__bar" />
        <div className="splash-loader__bar" />
        <div className="splash-loader__ball" />
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
// SplashScreen
// ---------------------------------------------------------------------------
interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fading, setFading] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Start fade out at 2700ms
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2700);

    // At 3000ms: call onComplete to unmount
    const doneTimer = setTimeout(() => {
      onCompleteRef.current();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#FAF5EF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 300ms ease-out' : 'none',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Wordmark */}
      <div style={{ textAlign: 'center', userSelect: 'none' }}>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.5rem',       /* ~text-2xl */
            fontWeight: 700,
            letterSpacing: '0.2em',   /* tracking-widest */
            lineHeight: 1,
          }}
        >
          <span style={{ color: '#0b1b3d' }}>SPEED</span>
          <span style={{ color: '#2c8fff' }}>LINK</span>
        </div>
        <p
          style={{
            marginTop: '0.5rem',
            color: '#475569',          /* text-slate-600 — darkened for cream bg */
            fontSize: '0.875rem',      /* text-sm */
            letterSpacing: '0.05em',  /* tracking-wide */
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Enjoy Unlimited Fibre Internet
        </p>
      </div>

      {/* Animated Loader — internal styles/keyframes untouched */}
      <Loader />

      {/* Status line */}
      <p
        className="animate-pulse"
        style={{
          color: '#64748b',           /* text-slate-500 — legible on cream bg */
          fontSize: '0.75rem',        /* text-xs */
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '0.05em',
        }}
      >
        Initializing network services...
      </p>
    </div>
  );
}
