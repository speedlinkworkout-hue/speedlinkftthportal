import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/Router';

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
// To remove the splash, delete this import and the JSX block marked below.
import { SplashScreen } from '@/components/SplashScreen';
// ─────────────────────────────────────────────────────────────────────────────

export function App() {
  // ─── SPLASH SCREEN ──────────────────────────────────────────────────────────
  // RouterProvider is always mounted so the login page renders underneath while
  // the splash overlay is visible — this prevents any white flash on transition.
  // Shows on every fresh page load (no sessionStorage / localStorage used).
  // To remove: delete the useState, the SplashScreen JSX, and the import above.
  const [showSplash, setShowSplash] = useState(true);
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ─── SPLASH SCREEN ─────────────────────────────────────────────────── */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      {/* ─────────────────────────────────────────────────────────────────────── */}

      {/* Always mounted — login page is ready the instant the splash fades */}
      <RouterProvider router={router} />
    </>
  );
}
