'use client';

import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import TeaserGate from './components/TeaserGate';
import ResultsDashboard from './components/ResultsDashboard';
import { calculateScore, getActionItems } from './utils/questions';

function encodeResults(data) {
  return window.btoa(encodeURIComponent(JSON.stringify(data)));
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
  const [leadData, setLeadData] = useState(null);
  const [results, setResults] = useState(null);

  // On mount, check URL hash for encoded results
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#results=')) {
      const encoded = hash.slice('#results='.length);
      const decoded = decodeResults(encoded);
      if (decoded) {
        setResults(decoded);
        setStep('results');
      }
    }
  }, []);

  const handleStartAssessment = () => {
    setStep('form');
    window.scrollTo(0, 0);
  };

  const handleAssessment = (answers) => {
    const scoreResults = calculateScore(answers);
    const actionItems = getActionItems(answers, scoreResults.sectionScores);
    const finalResults = { ...scoreResults, actionItems, answers };
    setResults(finalResults);
    setStep('teaser');
    window.scrollTo(0, 0);
  };

  const handleLeadSubmit = (data) => {
    setLeadData(data);
    // Encode results into URL hash
    const encoded = encodeResults(results);
    window.location.hash = `results=${encoded}`;
    setStep('results');
    window.scrollTo(0, 0);
  };

  return (
    <>
      {step === 'landing' && <LandingPage onStart={handleStartAssessment} />}
      {step === 'form' && <AssessmentForm onSubmit={handleAssessment} />}
      {step === 'teaser' && (
        <TeaserGate results={results} onSubmit={handleLeadSubmit} />
      )}
      {step === 'results' && (
        <ResultsDashboard results={results} leadData={leadData} />
      )}
    </>
  );
}

export default App;
