import React, { useState } from 'react';
import LandingPage from './src/components/LandingPage';
import Extractor from './src/components/Extractor';

type ViewState = 'landing' | 'app';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  const navigateToApp = () => {
    setCurrentView('app');
    window.scrollTo(0, 0);
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
    window.scrollTo(0, 0);
  };

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage onStart={navigateToApp} />
      ) : (
        <Extractor onBack={navigateToLanding} />
      )}
    </>
  );
};

export default App;
