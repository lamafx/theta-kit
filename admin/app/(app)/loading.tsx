/** Réponse immédiate au clic : la forme de la page arrive tout de suite, les données ensuite. */
export default function Chargement() {
  return (
    <div className="squelette" aria-busy="true" aria-label="Chargement">
      <i style={{ width: 140, height: 12 }} />
      <i style={{ width: 'min(520px, 80%)', height: 54, marginTop: 18 }} />
      <i style={{ width: 'min(380px, 60%)', height: 18, marginTop: 18 }} />
      <div className="squelette-grille">
        {[0, 1, 2].map((k) => (
          <div key={k}>
            <i style={{ width: '40%', height: 12 }} />
            <i style={{ width: '70%', height: 44, marginTop: 16 }} />
            <i style={{ width: '90%', height: 14, marginTop: 14 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
