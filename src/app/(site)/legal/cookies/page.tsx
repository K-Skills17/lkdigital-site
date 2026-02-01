import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | LK Digital",
  description:
    "Entenda como utilizamos cookies para melhorar sua experiência no site da LK Digital e como você pode gerenciar suas preferências.",
};

export default function CookiesPage() {
  return (
    <>
      <h1>Política de Cookies</h1>

      <p className="last-updated">Última atualização: 1 de Fevereiro de 2026</p>

      <p className="lead">
        Esta política explica como utilizamos cookies e tecnologias similares
        para melhorar sua experiência de navegação e entender como você interage
        com nossa filosofia de crescimento. Valorizamos sua privacidade e
        oferecemos controle total sobre suas preferências.
      </p>

      <hr />

      <h2>1. O Que São Cookies?</h2>

      <p>
        Cookies são pequenos arquivos de texto armazenados no seu dispositivo
        (computador, tablet ou smartphone) quando você visita um website. Eles
        permitem que o site "lembre" suas ações e preferências ao longo do
        tempo, proporcionando uma experiência mais personalizada e eficiente.
      </p>

      <p>
        Os cookies não podem acessar outras informações do seu dispositivo nem
        executar programas. São ferramentas padrão da web, utilizadas por
        praticamente todos os sites modernos.
      </p>

      <h2>2. Tipos de Cookies que Utilizamos</h2>

      <h3>Cookies Estritamente Necessários</h3>
      <p>
        Essenciais para o funcionamento básico do site. Sem eles, algumas
        funcionalidades não estariam disponíveis. Não requerem consentimento
        pois são indispensáveis.
      </p>
      <ul>
        <li>
          <strong>Sessão:</strong> Mantêm você conectado durante a navegação
        </li>
        <li>
          <strong>Segurança:</strong> Protegem contra atividades maliciosas
        </li>
        <li>
          <strong>Preferências de cookies:</strong> Armazenam suas escolhas
          sobre quais cookies aceitar
        </li>
      </ul>

      <h3>Cookies de Performance e Analytics</h3>
      <p>
        Coletam informações anônimas sobre como os visitantes utilizam nosso
        site, ajudando-nos a melhorar continuamente a experiência.
      </p>
      <ul>
        <li>
          <strong>Google Analytics:</strong> Métricas de visitação, páginas mais
          acessadas, tempo de permanência e origem do tráfego
        </li>
        <li>
          <strong>Vercel Analytics:</strong> Performance técnica e velocidade de
          carregamento
        </li>
      </ul>
      <p>
        <strong>Nota:</strong> Configuramos esses serviços para anonimizar
        endereços IP e não compartilhar dados com terceiros para fins
        publicitários.
      </p>

      <h3>Cookies de Funcionalidade</h3>
      <p>
        Permitem que o site ofereça funcionalidades aprimoradas e
        personalização:
      </p>
      <ul>
        <li>Preferências de idioma</li>
        <li>Região geográfica detectada</li>
        <li>Formulários parcialmente preenchidos</li>
      </ul>

      <h3>Cookies de Marketing (Opcional)</h3>
      <p>
        Atualmente, <strong>não utilizamos cookies de marketing</strong> ou
        rastreamento publicitário. Não exibimos anúncios de terceiros nem
        compartilhamos dados para fins de remarketing.
      </p>
      <p>
        Caso isso mude no futuro, atualizaremos esta política e solicitaremos
        seu consentimento explícito.
      </p>

      <h2>3. Cookies de Terceiros</h2>

      <p>
        Alguns cookies são definidos por serviços de terceiros que aparecem em
        nossas páginas:
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border)" }}>
            <th style={{ textAlign: "left", padding: "0.75rem 0" }}>Serviço</th>
            <th style={{ textAlign: "left", padding: "0.75rem 0" }}>Finalidade</th>
            <th style={{ textAlign: "left", padding: "0.75rem 0" }}>Mais Informações</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <td style={{ padding: "0.75rem 0" }}>Google Analytics</td>
            <td style={{ padding: "0.75rem 0" }}>Analytics</td>
            <td style={{ padding: "0.75rem 0" }}>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Política do Google
              </a>
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <td style={{ padding: "0.75rem 0" }}>Vercel</td>
            <td style={{ padding: "0.75rem 0" }}>Hospedagem e Performance</td>
            <td style={{ padding: "0.75rem 0" }}>
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                Política da Vercel
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>4. Duração dos Cookies</h2>

      <p>
        Os cookies têm diferentes períodos de validade:
      </p>

      <ul>
        <li>
          <strong>Cookies de sessão:</strong> Expiram quando você fecha o
          navegador
        </li>
        <li>
          <strong>Cookies persistentes:</strong> Permanecem no seu dispositivo
          por um período definido (geralmente entre 30 dias e 2 anos)
        </li>
      </ul>

      <p>
        Você pode verificar e gerenciar todos os cookies armazenados através das
        configurações do seu navegador.
      </p>

      <h2>5. Seu Controle sobre Cookies</h2>

      <p>
        Você tem controle total sobre os cookies não essenciais. Pode gerenciá-los
        de várias formas:
      </p>

      <h3>Através do Navegador</h3>
      <p>
        Todos os navegadores modernos permitem gerenciar cookies. Você pode:
      </p>
      <ul>
        <li>Visualizar cookies armazenados</li>
        <li>Excluir cookies específicos ou todos os cookies</li>
        <li>Bloquear cookies de terceiros</li>
        <li>Configurar notificações quando um cookie for definido</li>
        <li>Navegar em modo privado/anônimo</li>
      </ul>

      <p>
        <strong>Como acessar as configurações de cookies:</strong>
      </p>
      <ul>
        <li>
          <strong>Chrome:</strong> Configurações → Privacidade e segurança →
          Cookies
        </li>
        <li>
          <strong>Firefox:</strong> Configurações → Privacidade e Segurança →
          Cookies
        </li>
        <li>
          <strong>Safari:</strong> Preferências → Privacidade → Cookies
        </li>
        <li>
          <strong>Edge:</strong> Configurações → Cookies e permissões do site
        </li>
      </ul>

      <h3>Opt-out de Analytics</h3>
      <p>
        Para desativar especificamente o Google Analytics em todos os sites,
        você pode instalar o{" "}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="noopener noreferrer"
        >
          complemento de desativação do Google Analytics
        </a>
        .
      </p>

      <h2>6. Impacto da Desativação de Cookies</h2>

      <p>
        Se você optar por bloquear ou excluir cookies, algumas funcionalidades
        do site podem ser afetadas:
      </p>

      <ul>
        <li>Preferências podem não ser salvas entre visitas</li>
        <li>Formulários podem precisar ser preenchidos novamente</li>
        <li>Algumas funcionalidades interativas podem não funcionar corretamente</li>
      </ul>

      <p>
        Os cookies estritamente necessários não podem ser desativados, pois são
        essenciais para o funcionamento básico do site.
      </p>

      <h2>7. Tecnologias Similares</h2>

      <p>
        Além de cookies, podemos utilizar outras tecnologias de armazenamento
        local:
      </p>

      <ul>
        <li>
          <strong>Local Storage:</strong> Armazenamento de preferências de
          interface no navegador
        </li>
        <li>
          <strong>Session Storage:</strong> Dados temporários durante a
          navegação
        </li>
      </ul>

      <p>
        Estas tecnologias são gerenciadas da mesma forma que os cookies e
        respeitam as mesmas políticas de privacidade.
      </p>

      <h2>8. Cookies em Dispositivos Móveis</h2>

      <p>
        Em dispositivos móveis, os cookies funcionam de forma similar. Você pode
        gerenciá-los através das configurações do navegador móvel ou nas
        configurações de privacidade do sistema operacional (iOS ou Android).
      </p>

      <h2>9. Atualizações desta Política</h2>

      <p>
        Podemos atualizar esta Política de Cookies periodicamente para refletir
        mudanças nos cookies que utilizamos ou por outras razões operacionais,
        legais ou regulatórias.
      </p>

      <p>
        Recomendamos que você visite esta página regularmente para se manter
        informado sobre nosso uso de cookies.
      </p>

      <h2>10. Contato</h2>

      <p>
        Se você tiver dúvidas sobre nossa Política de Cookies:
      </p>

      <ul>
        <li>
          <strong>E-mail:</strong> privacidade@lkdigital.com.br
        </li>
        <li>
          <strong>Formulário:</strong> <a href="/contato">Página de Contato</a>
        </li>
      </ul>

      <p>
        Estamos sempre disponíveis para esclarecer como utilizamos tecnologias
        de rastreamento e como você pode exercer suas preferências de
        privacidade.
      </p>
    </>
  );
}
