'use client';

import { useState, useEffect } from 'react';
import ConvenioForm from './components/ConvenioForm';
import TeaserGate from './components/TeaserGate';
import ResultsDashboard from './components/ResultsDashboard';

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
  const [step, setStep] = useState('form');
  const [results, setResults] = useState(null);
  const [formInputs, setFormInputs] = useState(null);

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

  const handleCalculate = (inputs, calcResults) => {
    setFormInputs(inputs);
    setResults(calcResults);
    setStep('teaser');
    window.scrollTo(0, 0);
  };

  const handleLeadSubmitted = () => {
    const encoded = encodeResults(results);
    if (encoded) {
      const newUrl = window.location.origin + window.location.pathname + '#results=' + encoded;
      window.history.replaceState(null, '', newUrl);
    }
    setStep('results');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {step === 'form' && <ConvenioForm onCalculate={handleCalculate} />}
        {step === 'teaser' && (
          <TeaserGate results={results} formInputs={formInputs} onLeadSubmitted={handleLeadSubmitted} />
        )}
        {step === 'results' && <ResultsDashboard results={results} />}
      </div>

    </div>
  );
}

export default App;
