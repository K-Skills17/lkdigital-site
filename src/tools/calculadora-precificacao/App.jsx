'use client';

import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import PricingForm from './components/PricingForm';
import TeaserGate from './components/TeaserGate';
import ResultsDashboard from './components/ResultsDashboard';
import { calculatePricing } from './utils/calculations';

function encodeResults(data) {
  try {
    return window.btoa(encodeURIComponent(JSON.stringify(data)));
  } catch {
    return null;
  }
}

function decodeResults(hash) {
  try {
    return JSON.parse(decodeURIComponent(window.atob(hash)));
  } catch {
    return null;
  }
}

function App() {
  const [step, setStep] = useState('landing');
  const [results, setResults] = useState(null);
  const [formInputs, setFormInputs] = useState(null);

  // On mount, check URL hash for encoded results
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#results=')) {
      const encoded = hash.substring('#results='.length);
      const decoded = decodeResults(encoded);
      if (decoded) {
        setResults(decoded);
        setStep('results');
      }
    }
  }, []);

  const handleStartForm = () => {
    setStep('form');
    window.scrollTo(0, 0);
  };

  const handleCalculate = (inputs) => {
    const calcResults = calculatePricing(inputs);
    setResults(calcResults);
    setFormInputs(inputs);
    setStep('teaser');
    window.scrollTo(0, 0);
  };

  const handleLeadSubmitted = () => {
    // Build the hash URL
    const encoded = encodeResults(results);
    if (encoded) {
      const newUrl = window.location.origin + window.location.pathname + '#results=' + encoded;
      window.history.replaceState(null, '', newUrl);
    }
    setStep('results');
    window.scrollTo(0, 0);
  };

  return (
    <>
      {step === 'landing' && <LandingPage onStart={handleStartForm} />}
      {step === 'form' && (
        <PricingForm onCalculate={handleCalculate} />
      )}
      {step === 'teaser' && (
        <TeaserGate results={results} formInputs={formInputs} onLeadSubmitted={handleLeadSubmitted} />
      )}
      {step === 'results' && (
        <ResultsDashboard results={results} />
      )}
    </>
  );
}

export default App;
