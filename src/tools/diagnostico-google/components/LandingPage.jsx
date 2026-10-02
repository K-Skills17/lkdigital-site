export default function LandingPage({ onStart }) {
  return (
    <div className="landing">
      <div className="landing-logo">
        LK <span>Digital</span>
      </div>

      <h1 className="fade-up">
        Seu Google Meu Negócio está <em>atraindo</em> ou afastando pacientes?
      </h1>

      <p className="subtitle fade-up fade-up-delay-1">
        Avalie seu perfil em 2 minutos e descubra o que corrigir para aparecer
        no topo das buscas e receber mais ligações.
      </p>

      <div className="landing-cta fade-up fade-up-delay-2">
        <button type="button" className="btn-primary" onClick={onStart}>
          Avaliar Meu Perfil
        </button>
      </div>

      <div className="landing-checks fade-up fade-up-delay-2">
        <div className="check-item">Fotos e aparência do perfil</div>
        <div className="check-item">Avaliações e reputação</div>
        <div className="check-item">Informações e dados de contato</div>
        <div className="check-item">Posts e atualizações</div>
        <div className="check-item">Plano de ação personalizado</div>
      </div>

      <div className="landing-features fade-up fade-up-delay-3">
        <div className="landing-feature">
          <div className="number">2 min</div>
          <p>Para avaliar</p>
        </div>
        <div className="landing-feature">
          <div className="number">100%</div>
          <p>Gratuito</p>
        </div>
        <div className="landing-feature">
          <div className="number">5</div>
          <p>Ações prioritárias</p>
        </div>
      </div>

      <div className="footer">
        <a href="https://lkdigital.odo.br" target="_blank" rel="noopener noreferrer">
          lkdigital.odo.br
        </a>
      </div>
    </div>
  );
}
