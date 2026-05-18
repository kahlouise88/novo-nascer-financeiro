export default function Landing({ onStart }) {
  return (
    <div className="landing">
      <div className="landing-inner">
        <p className="landing-by">por Katharine Louise</p>
        <h1 className="landing-title">
          O Novo Nascer<br />
          <em>Financeiro</em>
        </h1>
        <div className="landing-divider" />
        <p className="landing-desc">
          Um diagnóstico íntimo e profundo para você enxergar com clareza onde está
          — e qual o caminho mais honesto para a sua liberdade. Sem julgamento.
          Sem fórmulas prontas. Apenas o seu próprio mapa.
        </p>
        <button className="btn-primary" onClick={onStart}>
          COMEÇAR MEU DIAGNÓSTICO →
        </button>
        <p className="landing-note">Cerca de 10 minutos · 100% confidencial</p>
        <p className="landing-sig">— Katharine Louise</p>
      </div>
    </div>
  )
}
