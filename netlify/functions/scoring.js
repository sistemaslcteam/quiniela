const ROUNDS = ["Dieciseisavos", "Octavos de Final", "Cuartos de Final", "Semifinal", "Final"];

const FASE_PUNTOS = {
  "Dieciseisavos": 1,
  "Octavos de Final": 2,
  "Cuartos de Final": 4,
  "Semifinal": 7,
  "Final": 10,
  "Campeón": 15
};

function scoreTicket(ticket, results) {
  let marcadores = 0;
  ROUNDS.forEach((round, i) => {
    const real = results.rounds && results.rounds[i];
    const pred = ticket.rounds && ticket.rounds[i];
    if (!real || real.mx === "" || real.mx === undefined || real.rv === "" || real.rv === undefined) return;
    if (!pred || pred.mx === "" || pred.mx === undefined || pred.rv === "" || pred.rv === undefined) return;
    const rmx = Number(real.mx), rrv = Number(real.rv);
    const pmx = Number(pred.mx), prv = Number(pred.rv);
    if (pmx === rmx && prv === rrv) {
      marcadores += 5;
    } else if (Math.sign(pmx - prv) === Math.sign(rmx - rrv)) {
      marcadores += 2;
    }
  });

  let extra = 0;
  if (results.fase && ticket.fase && results.fase === ticket.fase) {
    extra += FASE_PUNTOS[ticket.fase] || 0;
  }
  if (results.goleador && ticket.goleador && results.goleador === ticket.goleador) {
    extra += 3;
  }

  return { marcadores, extra, total: marcadores + extra };
}

module.exports = { ROUNDS, FASE_PUNTOS, scoreTicket };
