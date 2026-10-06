import { useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell,
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WHATSAPP_NUMBER } from '../config';

export default function ResultsDashboard({ results, leadData }) {
  const dashboardRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const clinicName = leadData?.clinica || 'Minha Clínica';
  const cityName = leadData?.cidade || 'Brasil';

  const whatsappMessage = encodeURIComponent(
    `Olá! Fiz o Diagnóstico do Google Meu Negócio da minha clínica "${clinicName}" e tirei ${results.totalScore}/100 (${results.gradeLabel}). Gostaria de saber como vocês podem otimizar meu perfil e atrair mais pacientes.`
  );
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2, backgroundColor: '#FAFAF8', useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`diagnostico-google-${clinicName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch {
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const chartData = results.sectionScores.map((s) => ({
    name: s.title,
    score: s.percent,
  }));

  const getBarColor = (percent) => {
    if (percent <= 30) return '#E74C3C';
    if (percent <= 50) return '#E67E22';
    if (percent <= 70) return '#F39C12';
    return '#27AE60';
  };

  const circumference = 2 * Math.PI * 45;
  const scoreOffset = circumference - (results.totalScore / 100) * circumference;

  return (
    <div className="results-page">
      <div className="container" ref={dashboardRef}>
        <div className="progress-bar">
          <div className="progress-step active" />
          <div className="progress-step active" />
          <div className="progress-step active" />
          <div className="progress-step active" />
        </div>

        <div className="results-header fade-up">
          <h2>Diagnóstico do Google</h2>
          <div className="clinic-name">{clinicName} — {cityName}</div>
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

        {/* Section breakdown */}
        <div className="chart-section fade-up">
          <h3>Pontuação por Categoria</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Section detail cards */}
        <div className="section-scores fade-up">
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

        {/* Action items */}
        <div className="action-plan fade-up">
          <h3>Plano de Ação Prioritário</h3>
          <p className="plan-subtitle">
            As ações mais importantes para melhorar seu perfil, ordenadas por impacto
          </p>

          {results.actionItems.map((action, i) => (
            <div className="action-card" key={i}>
              <div className="action-number">{i + 1}</div>
              <div className="action-content">
                <p>{action.text}</p>
                <span className={`impact-badge impact-${action.impact.toLowerCase()}`}>
                  Impacto {action.impact}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Benchmark */}
        <div className="benchmark-card fade-up">
          <h3>Você sabia?</h3>
          <p>
            Dentistas com perfil otimizado (nota 80+) recebem em média <strong>3x mais ligações</strong> e{' '}
            <strong>2.7x mais pedidos de rota</strong> no Google Maps do que perfis incompletos.
          </p>
        </div>

        {/* CTA */}
        <div className="cta-section fade-up">
          <h3>Quer que a LK Digital Otimize seu Google?</h3>
          <p>
            Nós gerenciamos seu perfil no Google Meu Negócio e construímos sistemas que geram
            avaliações 5 estrelas de forma consistente.
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Falar com Especialista
          </a>
          <br />
          <button className="btn-secondary" onClick={handleExportPDF}>
            Baixar Diagnóstico em PDF
          </button>
          <br />
          <button className="btn-secondary btn-share" onClick={handleCopyLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {copied ? 'Link Copiado!' : 'Compartilhar Resultado'}
          </button>
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
