import { useState } from 'react';
import { formatCurrency } from '../utils/calculations';
import { submitLead } from '../../shared/backbone-client';

function encodeResults(data) {
  try {
    return window.btoa(encodeURIComponent(JSON.stringify(data)));
  } catch {
    return null;
  }
}

export default function TeaserGate({ results, onLeadSubmitted }) {
  const [form, setForm] = useState({ nome: '', clinica: '', email: '', whatsapp: '', cidade: '' });
  const [submitting, setSubmitting] = useState(false);

  const isValid = form.nome && form.clinica && form.email && form.whatsapp;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);

    // Send to the shared backbone (fire-and-forget, don't block UX)
    const reportUrl = window.location.origin + window.location.pathname + '#results=' + encodeResults(results);
    const topIssues = results.procedimentosAbaixoCusto.map(p => `${p.nome} esta abaixo do custo`);

    submitLead('calculadora-precificacao', {
      name: form.nome,
      phone: form.whatsapp,
      clinicName: form.clinica,
      email: form.email,
      city: form.cidade,
      reportUrl,
      pricingData: {
        lucroHoraReal: results.lucroHoraReal,
        custoPorHora: results.custoPorHora,
        abaixoCusto: results.procedimentosAbaixoCusto.length,
        totalProcedimentos: results.results.length,
        topIssues,
        procedures: results.results.slice(0, 8).map(r => ({
          nome: r.nome,
          precoAtual: r.precoAtual,
          precoRecomendado: r.precoRecomendado,
          custoTotal: r.custoTotal,
          abaixoCusto: r.abaixoCusto,
        })),
      },
    }, { value: results.lucroHoraReal });

    setSubmitting(false);
    onLeadSubmitted(form);
  };

  return (
    <div className="results-page">
      <div className="container">
        <div className="progress-bar">
          <div className="progress-step active" />
          <div className="progress-step active" />
          <div className="progress-step" />
        </div>

        <div className="results-header fade-up">
          <h2>Prévia do Resultado</h2>
          <p style={{ color: '#888', marginTop: 4 }}>
            Seus números foram calculados! Veja o destaque abaixo.
          </p>
        </div>

        {/* Real hourly rate — the big reveal */}
        <div className="big-number-card fade-up fade-up-delay-1">
          <div className="label">Sua hora real de trabalho</div>
          <div className="amount" style={{ color: results.lucroHoraReal < 50 ? '#E74C3C' : results.lucroHoraReal < 150 ? '#F39C12' : '#27AE60' }}>
            {formatCurrency(results.lucroHoraReal)}/hora
          </div>
          <div className="annual">
            Custo fixo por hora de cadeira: <span>{formatCurrency(results.custoPorHora)}</span>
          </div>
        </div>

        {/* Below cost alert */}
        {results.procedimentosAbaixoCusto.length > 0 && (
          <div className="alert-card fade-up">
            <div className="alert-icon">!</div>
            <div>
              <strong>Atenção:</strong> Você tem {results.procedimentosAbaixoCusto.length} procedimento(s) com preço ABAIXO DO CUSTO.
              Você está pagando para trabalhar nesses procedimentos.
            </div>
          </div>
        )}

        {/* Blurred preview of detailed results */}
        <div className="fade-up" style={{ position: 'relative', marginTop: 24 }}>
          <div style={{
            filter: 'blur(8px)',
            pointerEvents: 'none',
            userSelect: 'none',
            opacity: 0.6,
          }}>
            {results.results.slice(0, 2).map((r, i) => (
              <div className={`pricing-card ${r.abaixoCusto ? 'below-cost' : ''}`} key={i}>
                <div className="pricing-card-header">
                  <h3>{r.nome}</h3>
                  {r.abaixoCusto && <span className="badge-danger">ABAIXO DO CUSTO</span>}
                </div>
                <div className="price-comparison">
                  <div className="price-box current">
                    <div className="price-label">Seu preço atual</div>
                    <div className="price-value">{formatCurrency(r.precoAtual)}</div>
                  </div>
                  <div className="price-box recommended">
                    <div className="price-label">Recomendado</div>
                    <div className="price-value" style={{ color: '#C4A265' }}>{formatCurrency(r.precoRecomendado)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overlay message */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              padding: '20px 32px',
              borderRadius: 12,
              textAlign: 'center',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              maxWidth: 400,
            }}>
              <strong style={{ fontSize: 16 }}>Preencha seus dados abaixo para desbloquear a análise completa</strong>
              <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                Preço mínimo, recomendado, premium e comparativo de cada procedimento.
              </p>
            </div>
          </div>
        </div>

        {/* Lead capture form */}
        <div className="section-card fade-up" style={{ marginTop: 32 }}>
          <h3 className="section-title">Desbloqueie Seu Resultado Completo</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Seu nome</label>
                <input
                  type="text"
                  placeholder="Ex: Dr. João"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nome da clínica</label>
                <input
                  type="text"
                  placeholder="Ex: Odonto Vida"
                  value={form.clinica}
                  onChange={(e) => setForm({ ...form, clinica: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Seu melhor e-mail</label>
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Cidade <span className="hint">(opcional)</span></label>
                <input
                  type="text"
                  placeholder="Ex: São Paulo"
                  value={form.cidade}
                  onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: 16 }}>
              <button type="submit" className="btn-primary" disabled={!isValid || submitting}>
                {submitting ? 'Desbloqueando...' : 'Ver Resultado Completo'}
              </button>
            </div>
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
          <a href="https://lkdigital.odo.br" target="_blank" rel="noopener noreferrer">LK Digital</a>
          {' '}— Sistemas que funcionam para dentistas
        </div>
      </div>
    </div>
  );
}
