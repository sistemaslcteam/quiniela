const { getStore } = require("@netlify/blobs");

function quinielaStore() {
  return getStore({
    name: "quiniela",
    siteID: process.env.BLOBS_SITE_ID,
    token: process.env.BLOBS_TOKEN
  });
}

function slug(name) {
  return name.trim().toLowerCase()
    .replace(/[áàä]/g, "a").replace(/[éèë]/g, "e").replace(/[íìï]/g, "i")
    .replace(/[óòö]/g, "o").replace(/[úùü]/g, "u").replace(/ñ/g, "n")
    .replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
}

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

  const name = (data.name || "").trim();
  if (!name) return { statusCode: 400, body: JSON.stringify({ error: "Falta el nombre" }) };
  if (!data.fase) return { statusCode: 400, body: JSON.stringify({ error: "Falta la fase" }) };
  if (!data.goleador) return { statusCode: 400, body: JSON.stringify({ error: "Falta el goleador" }) };

  const id = slug(name);
  const store = quinielaStore();

  const ticket = {
    name,
    fase: data.fase,
    goleador: data.goleador,
    rounds: data.rounds || [],
    updatedAt: new Date().toISOString()
  };

  await store.setJSON(`ticket:${id}`, ticket);

  let roster = (await store.get("roster", { type: "json" })) || [];
  if (!roster.some(r => r.id === id)) {
    roster.push({ id, name });
    await store.setJSON("roster", roster);
  } else {
    roster = roster.map(r => (r.id === id ? { id, name } : r));
    await store.setJSON("roster", roster);
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, count: roster.length })
  };
};
