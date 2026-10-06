import { useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { formatCurrency } from '../utils/calculations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WHATSAPP_NUMBER } from '../config';

export default function ResultsDashboard({ results }) {
  const dashboardRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Olá! Fiz a Calculadora de Precificação e descobri que minha hora real é ${formatCurrency(results.lucroHoraReal)}/hora${results.procedimentosAbaixoCusto.length > 0 ? ` e tenho ${results.procedimentosAbaixoCusto.length} procedimento(s) abaixo do custo` : ''}. Gostaria de saber como atrair pacientes que valorizam qualidade.`
  );
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

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
      pdf.save('precificacao.pdf');
    } catch {
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const chartData = results.results.map((r) => ({
    name: r.nome.length > 12 ? r.nome.substring(0, 12) + '...' : r.nome,
    'Preço Atual': r.precoAtual,
    'Preço Mínimo': Math.round(r.precoMinimo),
    'Recomendado': Math.round(r.precoRecomendado),
  }));

  return (
    <div className="results-page">
      <div className="container" ref={dashboardRef}>
        <div className="progress-bar">
          <div className="progress-step active" />
          <div className="progress-step active" />
          <div className="progress-step active" />
        </div>

        <div className="results-header fade-up">
          <h2>Resultado da Precificação</h2>
          <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Regime: {results.regimeName}</div>
        </div>

        {/* Hourly rate reveal */}
        <div className="big-number-card fade-up fade-up-delay-1">
          <div className="label">Sua hora real de trabalho</div>
          <div className="amount" style={{ color: results.lucroHoraReal < 50 ? '#E74C3C' : results.lucroHoraReal < 150 ? '#F39C12' : '#27AE60' }}>
            {formatCurrency(results.lucroHoraReal)}/hora
          </div>
          <div className="annual">
            Custo fixo por hora de cadeira: <span>{formatCurrency(results.custoPorHora)}</span>
          </div>
        </div>

        {/* Alert for below-cost procedures */}
        {results.procedimentosAbaixoCusto.length > 0 && (
          <div className="alert-card fade-up">
            <div className="alert-icon">!</div>
            <div>
              <strong>Atenção:</strong> Você tem {results.procedimentosAbaixoCusto.length} procedimento(s) com preço ABAIXO DO CUSTO.
              Você está pagando para trabalhar nesses procedimentos.
            </div>
          </div>
        )}

        {/* Per-procedure cards */}
        {results.results.map((r, i) => (
          <div className={`pricing-card fade-up ${r.abaixoCusto ? 'below-cost' : ''}`} key={i}>
            <div className="pricing-card-header">
              <h3>{r.nome}</h3>
              {r.abaixoCusto && <span className="badge-danger">ABAIXO DO CUSTO</span>}
            </div>

            <div className="cost-breakdown">
              <div className="cost-row">
                <span>Material</span><span>{formatCurrency(r.custoMaterial)}</span>
              </div>
              <div className="cost-row">
                <span>Laboratório</span><span>{formatCurrency(r.custoLab)}</span>
              </div>
              <div className="cost-row">
                <span>Tempo de cadeira ({r.tempoMinutos}min)</span><span>{formatCurrency(r.custoTempo)}</span>
              </div>
              <div className="cost-row total">
                <span>Custo total</span><span>{formatCurrency(r.custoBase)}</span>
              </div>
            </div>

            <div className="price-comparison">
              <div className="price-box current" style={{ borderColor: r.abaixoCusto ? '#E74C3C' : '#27AE60' }}>
                <div className="price-label">Seu preço atual</div>
                <div className="price-value" style={{ color: r.abaixoCusto ? '#E74C3C' : '#27AE60' }}>{formatCurrency(r.precoAtual)}</div>
              </div>
              <div className="price-box">
                <div className="price-label">Preço mínimo</div>
                <div className="price-value">{formatCurrency(r.precoMinimo)}</div>
              </div>
              <div className="price-box recommended">
                <div className="price-label">Recomendado (30%)</div>
                <div className="price-value" style={{ color: '#C4A265' }}>{formatCurrency(r.precoRecomendado)}</div>
              </div>
              <div className="price-box">
                <div className="price-label">Premium (50%)</div>
                <div className="price-value">{formatCurrency(r.precoPremium)}</div>
              </div>
            </div>

            <div className="hourly-reveal">
              Sua hora real nesse procedimento: <strong style={{ color: r.lucroHoraAtual < 0 ? '#E74C3C' : '#27AE60' }}>
                {formatCurrency(r.lucroHoraAtual)}/hora
              </strong>
            </div>
          </div>
        ))}

        {/* Chart comparison */}
        <div className="chart-section fade-up">
          <h3>Comparativo de Preços</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DC" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${v}`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="Preço Atual" fill="#6B6B6B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Preço Mínimo" fill="#E74C3C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Recomendado" fill="#C4A265" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue summary */}
        <div className="summary-card fade-up">
          <h3>Resumo Mensal</h3>
          <div className="revenue-compare">
            <div>
              <div className="rev-label">Receita atual</div>
              <div className="rev-value">{formatCurrency(results.totalReceitaAtual)}/mês</div>
            </div>
            <div className="rev-arrow">→</div>
            <div>
              <div className="rev-label">Receita com preço recomendado</div>
              <div className="rev-value green">{formatCurrency(results.totalReceitaRecomendada)}/mês</div>
            </div>
          </div>
          <div className="rev-diff">
            Diferença: <strong>{formatCurrency(results.totalReceitaRecomendada - results.totalReceitaAtual)}/mês</strong>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section fade-up">
          <h3>Agora Você Sabe Quanto Cobrar</h3>
          <p>
            Mas está atraindo pacientes que valorizam qualidade e estão dispostos a pagar o preço justo?
            Nós construímos sistemas de marketing que atraem exatamente esse perfil de paciente.
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Falar com Especialista
          </a>
          <br />
          <button className="btn-secondary" onClick={handleExportPDF}>Baixar Precificação em PDF</button>
          <br />
          <button className="btn-secondary" onClick={handleShare} style={{ marginTop: 8 }}>
            {copied ? 'Link copiado!' : 'Compartilhar Resultado'}
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

      </div>
    </div>
  );
}
