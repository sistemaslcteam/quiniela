const { getStore } = require("@netlify/blobs");

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
  const results = {
    rounds: data.rounds || [],
    fase: data.fase || "",
    goleador: data.goleador || "",
    updatedAt: new Date().toISOString()
  };
  await store.setJSON("results", results);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true })
  };
};
