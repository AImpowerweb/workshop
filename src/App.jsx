import { useEffect, useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import PrototypeList from './components/PrototypeList';
import PrototypePage from './components/PrototypePage';
import WorkshopPage from './components/WorkshopPage';
import IntroSection from './components/IntroSection';
import Footer from './components/Footer';
import { content } from './data/content';

// ─────────────────────────────────────────────────────────────────────────────
//  Tiny hash router — no dependency, works on any static host.
//    #/prototype/<id>  → dedicated prototype page
//    #/workshop        → workshop write-up page
//    anything else     → landing page (plain #about / #prototypes anchors
//                        still behave as in-page jumps)
// ─────────────────────────────────────────────────────────────────────────────
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHashRoute();
  const pageMatch = hash.match(/^#\/prototype\/([\w-]+)/);
  const isWorkshopPage = /^#\/workshop\b/.test(hash);
  const onSubPage = Boolean(pageMatch) || isWorkshopPage;

  // When returning from a sub-page via an anchor link (#prototypes etc.), the
  // target only exists after the landing page re-renders — scroll manually.
  useEffect(() => {
    if (onSubPage) return;
    const anchor = hash.replace('#', '');
    if (!anchor) return;
    requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView());
  }, [hash, onSubPage]);

  return (
    <LanguageProvider>
      <div id="top" className="min-h-screen bg-white text-slate-900">
        <Header />
        <main>
          {pageMatch ? (
            <PrototypePage id={pageMatch[1]} />
          ) : isWorkshopPage ? (
            <WorkshopPage />
          ) : (
            <>
              <Hero />
              <PrototypeList />
              <IntroSection id="workshop" section={content.workshop} />
              <IntroSection id="team" section={content.team} alt />
            </>
          )}
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
