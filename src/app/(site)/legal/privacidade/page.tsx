import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | LK Digital",
  description:
    "Conheça nossa política de privacidade e como protegemos os dados da sua clínica odontológica com máxima confidencialidade.",
};

export default function PrivacidadePage() {
  return (
    <>
      <h1>Política de Privacidade</h1>

      <p className="last-updated">Última atualização: 1 de Fevereiro de 2026</p>

      <p className="lead">
        Na LK Digital, a confidencialidade é um pilar fundamental da nossa
        parceria. Esta política detalha como protegemos os dados da sua clínica
        e os seus dados profissionais, garantindo transparência total em todas
        as etapas do nosso relacionamento.
      </p>

      <hr />

      <h2>1. Introdução e Compromisso</h2>

      <p>
        Entendemos que a confiança é a base de qualquer parceria de sucesso. Por
        isso, tratamos suas informações com o mesmo cuidado e discrição que você
        dedica aos seus pacientes. Nossa abordagem à privacidade reflete nosso
        compromisso com a excelência em todos os aspectos do nosso serviço.
      </p>

      <p>
        Esta Política de Privacidade aplica-se a todas as informações coletadas
        através do nosso website, formulários de contato, consultorias
        estratégicas e qualquer interação com a LK Digital.
      </p>

      <h2>2. Dados que Coletamos</h2>

      <p>
        Coletamos apenas as informações estritamente necessárias para realizar a
        análise de viabilidade de crescimento da sua clínica e personalizar
        nossas estratégias. Estes dados incluem:
      </p>

      <h3>Dados de Identificação Profissional</h3>
      <ul>
        <li>Nome completo do diretor clínico ou responsável</li>
        <li>Nome e CNPJ da clínica ou consultório</li>
        <li>Registro profissional (CRO/OMD)</li>
        <li>Endereço de e-mail profissional</li>
        <li>Número de telefone para contato</li>
      </ul>

      <h3>Dados de Performance de Mercado</h3>
      <ul>
        <li>Localização geográfica da clínica</li>
        <li>Especialidades oferecidas</li>
        <li>Volume aproximado de atendimentos</li>
        <li>Objetivos de crescimento e desafios atuais</li>
        <li>Presença digital existente (website, redes sociais)</li>
      </ul>

      <h3>Dados de Navegação</h3>
      <ul>
        <li>Endereço IP (anonimizado)</li>
        <li>Tipo de navegador e dispositivo</li>
        <li>Páginas visitadas e tempo de permanência</li>
        <li>Origem do tráfego (como você nos encontrou)</li>
      </ul>

      <h2>3. Finalidade do Tratamento</h2>

      <p>
        Seus dados são utilizados exclusivamente para as seguintes finalidades:
      </p>

      <ul>
        <li>
          <strong>Personalização estratégica:</strong> Desenvolver um plano de
          marketing sob medida para as necessidades específicas da sua clínica
        </li>
        <li>
          <strong>Garantia de resultados:</strong> Monitorar e assegurar o
          cumprimento das nossas garantias de crescimento
        </li>
        <li>
          <strong>Comunicação relevante:</strong> Enviar atualizações sobre o
          progresso da sua estratégia e insights de mercado
        </li>
        <li>
          <strong>Melhoria contínua:</strong> Aprimorar nossos serviços e
          metodologias com base em feedback agregado e anonimizado
        </li>
      </ul>

      <p>
        <strong>Importante:</strong> Nunca vendemos, alugamos ou compartilhamos
        suas informações com terceiros para fins de marketing. Seus dados
        estratégicos de clínica são tratados com absoluta confidencialidade.
      </p>

      <h2>4. Segurança e Proteção</h2>

      <p>
        Implementamos medidas de segurança robustas para proteger suas
        informações contra acesso não autorizado, alteração, divulgação ou
        destruição:
      </p>

      <ul>
        <li>
          <strong>Criptografia de nível bancário:</strong> Todos os dados em
          trânsito são protegidos por TLS 1.3
        </li>
        <li>
          <strong>Armazenamento seguro:</strong> Dados em repouso são
          criptografados com AES-256
        </li>
        <li>
          <strong>Acesso restrito:</strong> Apenas membros autorizados da equipe
          têm acesso às informações de clientes
        </li>
        <li>
          <strong>Auditorias regulares:</strong> Realizamos revisões periódicas
          de segurança e conformidade
        </li>
        <li>
          <strong>Backup seguro:</strong> Cópias de segurança criptografadas em
          servidores geograficamente distribuídos
        </li>
      </ul>

      <h2>5. Seus Direitos</h2>

      <p>
        Em conformidade com a Lei Geral de Proteção de Dados (LGPD) e o
        Regulamento Geral de Proteção de Dados (RGPD), você tem os seguintes
        direitos:
      </p>

      <ul>
        <li>
          <strong>Direito de acesso:</strong> Solicitar uma cópia de todos os
          dados que mantemos sobre você
        </li>
        <li>
          <strong>Direito de retificação:</strong> Corrigir informações
          imprecisas ou incompletas
        </li>
        <li>
          <strong>Direito de exclusão:</strong> Solicitar a eliminação
          definitiva dos seus dados
        </li>
        <li>
          <strong>Direito de portabilidade:</strong> Receber seus dados em
          formato estruturado e transferível
        </li>
        <li>
          <strong>Direito de oposição:</strong> Opor-se ao tratamento dos seus
          dados para determinadas finalidades
        </li>
        <li>
          <strong>Direito de revogação:</strong> Retirar seu consentimento a
          qualquer momento
        </li>
      </ul>

      <p>
        Para exercer qualquer um destes direitos, entre em contato através do
        nosso{" "}
        <a href="/contato">formulário de contato</a> ou envie um e-mail para{" "}
        <strong>privacidade@lkdigital.com.br</strong>.
      </p>

      <h2>6. Retenção de Dados</h2>

      <p>
        Mantemos seus dados apenas pelo tempo necessário para cumprir as
        finalidades descritas nesta política:
      </p>

      <ul>
        <li>
          <strong>Dados de clientes ativos:</strong> Durante toda a duração da
          parceria e por 5 anos após o término
        </li>
        <li>
          <strong>Dados de prospectos:</strong> Por até 2 anos após o último
          contato
        </li>
        <li>
          <strong>Dados de navegação:</strong> Por até 26 meses (padrão de
          analytics)
        </li>
        <li>
          <strong>Documentos fiscais:</strong> Conforme exigência legal (mínimo
          5 anos)
        </li>
      </ul>

      <h2>7. Compartilhamento de Dados</h2>

      <p>
        Podemos compartilhar dados limitados com prestadores de serviço
        essenciais, sempre sob acordos de confidencialidade rigorosos:
      </p>

      <ul>
        <li>Provedores de hospedagem e infraestrutura (Vercel, AWS)</li>
        <li>Ferramentas de análise (Google Analytics - anonimizado)</li>
        <li>Serviços de e-mail transacional (Resend)</li>
        <li>Processadores de pagamento (quando aplicável)</li>
      </ul>

      <p>
        Todos os nossos parceiros são cuidadosamente selecionados e obrigados
        contratualmente a manter os mesmos padrões de privacidade e segurança.
      </p>

      <h2>8. Transferências Internacionais</h2>

      <p>
        Alguns dos nossos prestadores de serviço podem estar localizados fora do
        Brasil ou de Portugal. Nesses casos, garantimos que as transferências de
        dados sejam realizadas em conformidade com a legislação aplicável,
        utilizando cláusulas contratuais padrão ou certificações adequadas.
      </p>

      <h2>9. Alterações nesta Política</h2>

      <p>
        Podemos atualizar esta Política de Privacidade periodicamente para
        refletir mudanças nas nossas práticas ou na legislação aplicável.
        Notificaremos você sobre alterações significativas através do e-mail
        cadastrado ou mediante aviso destacado em nosso website.
      </p>

      <h2>10. Contato</h2>

      <p>
        Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como
        tratamos seus dados, entre em contato:
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
        Comprometemo-nos a responder todas as solicitações dentro de 15 dias
        úteis.
      </p>
    </>
  );
}
