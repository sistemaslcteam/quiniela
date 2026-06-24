const { getStore } = require("@netlify/blobs");
const { scoreTicket } = require("./scoring");

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

  const store = getStore("quiniela");
  const roster = (await store.get("roster", { type: "json" })) || [];
  const results = (await store.get("results", { type: "json" })) || { rounds: [], fase: "", goleador: "" };

  const tickets = [];
  for (const r of roster) {
    const ticket = await store.get(`ticket:${r.id}`, { type: "json" });
    if (ticket) tickets.push(ticket);
  }

  const leaderboard = tickets
    .map(t => {
      const score = scoreTicket(t, results);
      return { ...t, ...score };
    })
    .sort((a, b) => b.total - a.total);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ results, leaderboard })
  };
};
