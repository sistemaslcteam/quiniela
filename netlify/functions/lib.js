const { getStore } = require("@netlify/blobs");

function quinielaStore() {
  return getStore({
    name: "quiniela-equipos",
    siteID: process.env.BLOBS_SITE_ID,
    token: process.env.BLOBS_TOKEN
  });
}

const ENTRY_FEE = 100;

const STATUS_OPTIONS = [
  "Dieciseisavos",
  "Avanzó a Octavos",
  "Avanzó a Cuartos",
  "Avanzó a Semifinal",
  "Jugó la Final",
  "Jugó el partido por el 3er lugar",
  "Eliminado en Dieciseisavos",
  "Eliminado en Octavos",
  "Eliminado en Cuartos",
  "Campeón",
  "Subcampeón",
  "3er lugar",
  "4to lugar"
];

const ROUNDS_PAID = {
  "Dieciseisavos": 1,
  "Avanzó a Octavos": 2,
  "Avanzó a Cuartos": 3,
  "Avanzó a Semifinal": 4,
  "Jugó la Final": 5,
  "Jugó el partido por el 3er lugar": 5,
  "Eliminado en Dieciseisavos": 1,
  "Eliminado en Octavos": 2,
  "Eliminado en Cuartos": 3,
  "Campeón": 5,
  "Subcampeón": 5,
  "3er lugar": 5,
  "4to lugar": 5
};

function defaultTeams() {
  const teams = [];
  for (let i = 1; i <= 32; i++) {
    teams.push({
      id: i,
      name: `Equipo ${i}`,
      owner: null,
      status: "Dieciseisavos"
    });
  }
  return teams;
}

async function getTeams(store) {
  let teams = await store.get("teams", { type: "json" });
  if (!teams) {
    teams = defaultTeams();
    await store.setJSON("teams", teams);
  }
  return teams;
}

function computeSummary(teams) {
  let pot = 0;
  const assigned = teams.filter(t => t.owner);
  assigned.forEach(t => {
    const rounds = ROUNDS_PAID[t.status] || 1;
    pot += rounds * ENTRY_FEE;
  });
  const find = (status) => assigned.filter(t => t.status === status);
  return {
    pot,
    entriesCount: assigned.length,
    remainingTeams: teams.filter(t => !t.owner).length,
    premio1: Math.round(pot * 0.6),
    premio2: Math.round(pot * 0.25),
    premio3: Math.round(pot * 0.15),
    campeon: find("Campeón"),
    subcampeon: find("Subcampeón"),
    tercero: find("3er lugar"),
    cuarto: find("4to lugar")
  };
}

module.exports = { quinielaStore, getTeams, defaultTeams, computeSummary, STATUS_OPTIONS, ROUNDS_PAID, ENTRY_FEE };
