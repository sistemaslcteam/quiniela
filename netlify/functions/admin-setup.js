const { quinielaStore, getTeams } = require("./lib");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AZTECA2026";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "JSON inválido" }) };
  }
  if (data.password !== ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Clave incorrecta" }) };
  }

  const store = quinielaStore();
  const teams = await getTeams(store);
  const namesById = {};
  (data.names || []).forEach(n => { namesById[n.id] = n.name; });

  const updated = teams.map(t => ({
    ...t,
    name: namesById[t.id] !== undefined && namesById[t.id].trim() ? namesById[t.id].trim() : t.name
  }));

  await store.setJSON("teams", updated);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, teams: updated })
  };
};
