import { useState } from 'react';
import { PROCEDURE_PRESETS } from '../utils/calculations';

const emptyProcedure = {
  nome: '',
  custoMaterial: '',
  custoLab: '',
  tempoMinutos: '',
  precoAtual: '',
  quantidadeMensal: '',
};

export default function PricingForm({ onCalculate }) {
  const [clinica, setClinica] = useState({
    aluguel: '',
    folha: '',
    contasFixas: '',
    outrosCustos: '',
    regimeTributario: 'simples',
    horasPorDia: '',
    diasPorMes: '',
  });
  const [procedimentos, setProcedimentos] = useState([{ ...emptyProcedure }]);

  const updateClinica = (field, value) => setClinica((prev) => ({ ...prev, [field]: value }));

  const updateProc = (i, field, value) => {
    setProcedimentos((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [field]: value };
      return copy;
    });
  };

  const addProc = () => {
    if (procedimentos.length >= 5) return;
    setProcedimentos((prev) => [...prev, { ...emptyProcedure }]);
  };

  const removeProc = (i) => {
    if (procedimentos.length <= 1) return;
    setProcedimentos((prev) => prev.filter((_, idx) => idx !== i));
  };

  const isValid =
    clinica.aluguel && clinica.folha && clinica.horasPorDia && clinica.diasPorMes &&
    procedimentos.every((p) => p.nome && p.custoMaterial && p.tempoMinutos && p.precoAtual && p.quantidadeMensal);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({
      clinica: {
        aluguel: parseFloat(clinica.aluguel) || 0,
        folha: parseFloat(clinica.folha) || 0,
        contasFixas: parseFloat(clinica.contasFixas) || 0,
        outrosCustos: parseFloat(clinica.outrosCustos) || 0,
        regimeTributario: clinica.regimeTributario,
        horasPorDia: parseFloat(clinica.horasPorDia) || 8,
        diasPorMes: parseFloat(clinica.diasPorMes) || 22,
      },
      procedimentos: procedimentos.map((p) => ({
        nome: p.nome,
        custoMaterial: parseFloat(p.custoMaterial) || 0,
        custoLab: parseFloat(p.custoLab) || 0,
        tempoMinutos: parseFloat(p.tempoMinutos) || 30,
        precoAtual: parseFloat(p.precoAtual) || 0,
        quantidadeMensal: parseFloat(p.quantidadeMensal) || 0,
      })),
    });
  };

  return (
    <div className="diagnostic-page">
      <div className="container">
        <div className="progress-bar">
          <div className="progress-step active" />
          <div className="progress-step" />
          <div className="progress-step" />
        </div>

        <div className="diagnostic-header fade-up">
          <h2>Calculadora de Precificação</h2>
          <p>Preencha os dados reais da clínica e dos procedimentos que você mais realiza.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="section-card fade-up">
            <h3 className="section-title">Dados Gerais da Clínica</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Aluguel mensal (R$)</label>
                <input type="number" placeholder="Ex: 5000" value={clinica.aluguel} onChange={(e) => updateClinica('aluguel', e.target.value)} min="0" />
              </div>
              <div className="form-group">
                <label>Folha de pagamento (R$)</label>
                <input type="number" placeholder="Ex: 8000" value={clinica.folha} onChange={(e) => updateClinica('folha', e.target.value)} min="0" />
              </div>
              <div className="form-group">
                <label>Contas fixas (R$)<span className="hint"> (luz, internet, etc)</span></label>
                <input type="number" placeholder="Ex: 2000" value={clinica.contasFixas} onChange={(e) => updateClinica('contasFixas', e.target.value)} min="0" />
              </div>
              <div className="form-group">
                <label>Outros custos fixos (R$)</label>
                <input type="number" placeholder="Ex: 1000" value={clinica.outrosCustos} onChange={(e) => updateClinica('outrosCustos', e.target.value)} min="0" />
              </div>
              <div className="form-group">
                <label>Regime tributário</label>
                <select value={clinica.regimeTributario} onChange={(e) => updateClinica('regimeTributario', e.target.value)}>
                  <option value="simples">Simples Nacional (~11%)</option>
                  <option value="presumido">Lucro Presumido (~16.33%)</option>
                  <option value="mei">MEI</option>
                </select>
              </div>
              <div className="form-group">
                <label>Horas trabalhadas/dia</label>
                <input type="number" placeholder="Ex: 8" value={clinica.horasPorDia} onChange={(e) => updateClinica('horasPorDia', e.target.value)} min="1" max="16" />
              </div>
              <div className="form-group">
                <label>Dias trabalhados/mês</label>
                <input type="number" placeholder="Ex: 22" value={clinica.diasPorMes} onChange={(e) => updateClinica('diasPorMes', e.target.value)} min="1" max="31" />
              </div>
            </div>
          </div>

          {procedimentos.map((proc, i) => (
            <div className="section-card fade-up" key={i}>
              <div className="section-header">
                <h3 className="section-title">Procedimento {i + 1}</h3>
                {procedimentos.length > 1 && (
                  <button type="button" className="btn-remove" onClick={() => removeProc(i)}>Remover</button>
                )}
              </div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Nome do procedimento</label>
                  <input
                    type="text"
                    list="presets"
                    placeholder="Selecione ou digite..."
                    value={proc.nome}
                    onChange={(e) => updateProc(i, 'nome', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Custo do material (R$)</label>
                  <input type="number" placeholder="Ex: 25" value={proc.custoMaterial} onChange={(e) => updateProc(i, 'custoMaterial', e.target.value)} min="0" />
                </div>
                <div className="form-group">
                  <label>Custo do laboratório (R$)<span className="hint"> (se houver)</span></label>
                  <input type="number" placeholder="Ex: 0" value={proc.custoLab} onChange={(e) => updateProc(i, 'custoLab', e.target.value)} min="0" />
                </div>
                <div className="form-group">
                  <label>Tempo de cadeira (min)</label>
                  <input type="number" placeholder="Ex: 45" value={proc.tempoMinutos} onChange={(e) => updateProc(i, 'tempoMinutos', e.target.value)} min="1" />
                </div>
                <div className="form-group">
                  <label>Preço atual (R$)</label>
                  <input type="number" placeholder="Ex: 200" value={proc.precoAtual} onChange={(e) => updateProc(i, 'precoAtual', e.target.value)} min="0" />
                </div>
                <div className="form-group">
                  <label>Quantidade por mês</label>
                  <input type="number" placeholder="Ex: 15" value={proc.quantidadeMensal} onChange={(e) => updateProc(i, 'quantidadeMensal', e.target.value)} min="0" />
                </div>
              </div>
            </div>
          ))}

          <datalist id="presets">
            {PROCEDURE_PRESETS.map((p) => <option key={p} value={p} />)}
          </datalist>

          {procedimentos.length < 5 && (
            <div className="add-convenio-wrapper fade-up">
              <button type="button" className="btn-add-convenio" onClick={addProc}>+ Adicionar Procedimento</button>
            </div>
          )}

          <div className="form-actions fade-up">
            <button type="submit" className="btn-primary" disabled={!isValid}>Ver Minha Precificação</button>
          </div>
        </form>
      </div>
    </div>
  );
}
