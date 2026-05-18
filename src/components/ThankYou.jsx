export default function ThankYou({ onRestart }) {
  return (
    <div className="thankyou">
      <div className="thankyou-inner">
        <div className="thankyou-icon">🌱</div>
        <h1 className="thankyou-title">Seu diagnóstico foi enviado</h1>
        <div className="landing-divider" />
        <p className="thankyou-msg">
          A Katharine já recebeu a sua análise completa e vai entrar em contato
          para agendar a sua devolutiva — uma sessão só sua com ela.
          Fique de olho no seu WhatsApp. 💜
        </p>
        <p className="thankyou-sub">
          Você já deu o passo mais difícil. Você se viu. Isso muda tudo.
        </p>

        <div className="thankyou-divider" />

        <p className="thankyou-gift-label">Enquanto aguarda, um presente para você:</p>
        <a
          className="btn-primary"
          href="/ciclo.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Por que você gasta mais em certas semanas do mês →
        </a>

        <p className="thankyou-note">
          — Katharine Louise
        </p>
      </div>
    </div>
  )
}
