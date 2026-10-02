export default function LandingPage({ onStart }) {
  return (
    <div className="landing">
      <div className="landing-logo">LK <span>Digital</span></div>

      <h1 className="fade-up">
        Você sabe quanto <em>realmente custa</em> cada procedimento?
      </h1>

      <p className="subtitle fade-up fade-up-delay-1">
        Descubra se você está cobrando abaixo do custo, o preço ideal para cada
        procedimento e sua verdadeira hora de trabalho.
      </p>

      <div className="fade-up fade-up-delay-2" style={{ textAlign: 'center' }}>
        <button type="button" className="btn-primary" onClick={onStart}>
          Calcular Meus Preços
        </button>
      </div>

      <div className="landing-features fade-up fade-up-delay-3">
        <div className="landing-feature"><div className="number">3 min</div><p>Para calcular</p></div>
        <div className="landing-feature"><div className="number">100%</div><p>Gratuito</p></div>
        <div className="landing-feature"><div className="number">R$/h</div><p>Sua hora real</p></div>
      </div>

      <div className="footer">
        <a href="https://lkdigital.odo.br" target="_blank" rel="noopener noreferrer">lkdigital.odo.br</a>
      </div>
    </div>
  );
}
