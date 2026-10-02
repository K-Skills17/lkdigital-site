import { useState } from 'react';
import { submitLead } from '../../shared/backbone-client';

export default function TeaserGate({ results, onSubmit }) {
  const [form, setForm] = useState({
    nome: '',
    clinica: '',
    email: '',
    whatsapp: '',
    cidade: '',
  });
  const [sending, setSending] = useState(false);

  const isValid = form.nome && form.clinica && form.email;

  const circumference = 2 * Math.PI * 45;
  const scoreOffset = circumference - (results.totalScore / 100) * circumference;

  const getBarColor = (percent) => {
    if (percent <= 30) return '#E74C3C';
    if (percent <= 50) return '#E67E22';
    if (percent <= 70) return '#F39C12';
    return '#27AE60';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || sending) return;
    setSending(true);

    // Shared backbone: stores the lead, AI plan, CAPI Lead event, WhatsApp report (if a number was given)
    await submitLead('diagnostico-google', {
      name: form.nome,
      phone: form.whatsapp,
      clinicName: form.clinica,
      email: form.email,
      city: form.cidade,
      reportUrl: `${window.location.origin}${window.location.pathname}#results=${window.btoa(encodeURIComponent(JSON.stringify(results)))}`,
      results: {
        totalScore: results.totalScore,
        gradeLabel: results.gradeLabel,
        sectionScores: results.sectionScores,
        actionItems: results.actionItems,
        answers: results.answers,
      },
    }, { value: results.totalScore });

    setSending(false);
    onSubmit(form);
  };

  return (
    <div className="teaser-page">
      <div className="container">
        <div className="progress-bar">
          <div className="progress-step active" />
          <div className="progress-step active" />
          <div className="progress-step active" />
          <div className="progress-step" />
        </div>

        <div className="teaser-header fade-up">
          <h2>Seu Diagnóstico Está Pronto!</h2>
          <p>Veja seu score e desbloqueie o plano de ação completo.</p>
        </div>

        {/* Score gauge */}
        <div className="score-gauge-card fade-up fade-up-delay-1">
          <svg width="160" height="160" viewBox="0 0 100 100" className="score-ring">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#E8E4DC" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={results.gradeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={scoreOffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="score-center">
            <div className="score-number" style={{ color: results.gradeColor }}>{results.totalScore}</div>
            <div className="score-max">/100</div>
          </div>
          <div className="score-grade" style={{ color: results.gradeColor }}>
            {results.gradeLabel}
          </div>
        </div>

        {/* Category scores (visible) */}
        <div className="teaser-categories fade-up fade-up-delay-2">
          {results.sectionScores.map((s) => (
            <div className="section-score-card" key={s.id}>
              <div className="section-score-header">
                <span>{s.title}</span>
                <span style={{ color: getBarColor(s.percent), fontWeight: 700 }}>{s.score}/{s.maxPoints}</span>
              </div>
              <div className="section-bar-track">
                <div
                  className="section-bar-fill"
                  style={{ width: `${s.percent}%`, background: getBarColor(s.percent) }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Blurred action plan preview */}
        <div className="teaser-blurred fade-up fade-up-delay-3">
          <div className="blurred-overlay">
            <div className="blurred-content">
              <h3>Plano de Ação Prioritário</h3>
              <div className="blurred-item">1. Otimize suas fotos de perfil e capa para atrair mais cliques</div>
              <div className="blurred-item">2. Responda todas as avaliações para melhorar o engajamento</div>
              <div className="blurred-item">3. Atualize horários e informações de contato regularmente</div>
            </div>
            <div className="blurred-lock">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Preencha seus dados para desbloquear</span>
            </div>
          </div>
        </div>

        {/* Lead capture form */}
        <div className="teaser-gate fade-up fade-up-delay-4">
          <h3>Desbloqueie Seu Plano de Ação Completo</h3>
          <p>Preencha seus dados para ver as recomendações detalhadas e receber um link compartilhável do resultado.</p>

          <form className="lead-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Seu nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Nome da clínica"
              value={form.clinica}
              onChange={(e) => setForm({ ...form, clinica: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="WhatsApp (opcional)"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            />
            <input
              type="text"
              placeholder="Cidade (opcional)"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
            />
            <button type="submit" className="btn-primary" disabled={!isValid || sending}>
              {sending ? 'Enviando...' : 'Ver Resultado Completo'}
            </button>
          </form>
        </div>

        {/* Contact info */}
        <div className="contact-section">
          <p className="contact-label">Precisa de ajuda? Fale conosco:</p>
          <div className="contact-links">
            <a href="mailto:contato@lkdigital.org" className="contact-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4L12 13 2 4" />
              </svg>
              contato@lkdigital.org
            </a>
            <a href="tel:+5511946851028" className="contact-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              (11) 94685-1028
            </a>
          </div>
        </div>

        <div className="footer">
          Ferramenta gratuita por{' '}
          <a href="https://lkdigital.odo.br" target="_blank" rel="noopener noreferrer">
            LK Digital
          </a>{' '}
          — Sistemas que funcionam para dentistas
        </div>
      </div>
    </div>
  );
}
