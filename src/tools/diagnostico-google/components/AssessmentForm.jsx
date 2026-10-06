import { useState } from 'react';
import { sections } from '../utils/questions';

export default function AssessmentForm({ onSubmit }) {
  const [answers, setAnswers] = useState({});

  const setAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (allAnswered) onSubmit(answers);
  };

  return (
    <div className="diagnostic-page">
      <div className="container">
        <div className="progress-bar">
          <div className="progress-step active" />
          <div className="progress-step active" />
          <div className="progress-step" />
          <div className="progress-step" />
        </div>

        <div className="diagnostic-header fade-up">
          <h2>Diagnóstico do Google Meu Negócio</h2>
          <p>
            Responda cada pergunta olhando seu perfil no Google.
            Seja honesto — o diagnóstico só funciona com respostas reais.
          </p>
          <div className="answer-counter">
            {answeredCount} de {totalQuestions} respondidas
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {sections.map((section, si) => (
            <div className="section-card fade-up" key={section.id} style={{ animationDelay: `${si * 0.1}s` }}>
              <h3 className="section-title">{section.title}</h3>
              <div className="section-points">{section.maxPoints} pontos</div>

              {section.questions.map((q) => (
                <div className="question-block" key={q.id}>
                  <p className="question-text">{q.text}</p>
                  <div className="question-options">
                    {q.type === 'yesno' ? (
                      <>
                        <button
                          type="button"
                          className={`option-btn ${answers[q.id] === 'sim' ? 'selected' : ''}`}
                          onClick={() => setAnswer(q.id, 'sim')}
                        >
                          Sim
                        </button>
                        <button
                          type="button"
                          className={`option-btn ${answers[q.id] === 'nao' ? 'selected' : ''}`}
                          onClick={() => setAnswer(q.id, 'nao')}
                        >
                          Não
                        </button>
                      </>
                    ) : (
                      q.options.map((opt) => (
                        <button
                          type="button"
                          key={opt.value}
                          className={`option-btn ${answers[q.id] === opt.value ? 'selected' : ''}`}
                          onClick={() => setAnswer(q.id, opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="form-actions fade-up">
            <button type="submit" className="btn-primary" disabled={!allAnswered}>
              Ver Meu Diagnóstico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
