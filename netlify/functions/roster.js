const { getStore } = require("@netlify/blobs");

function slug(name) {
  return name.trim().toLowerCase()
    .replace(/[áàä]/g, "a").replace(/[éèë]/g, "e").replace(/[íìï]/g, "i")
    .replace(/[óòö]/g, "o").replace(/[úùü]/g, "u").replace(/ñ/g, "n")
    .replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
}

exports.handler = async (event) => {
  const store = getStore("quiniela");
  const params = event.queryStringParameters || {};

  if (params.name) {
    const id = slug(params.name);
    const ticket = await store.get(`ticket:${id}`, { type: "json" });
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket: ticket || null })
    };
  }

  const roster = (await store.get("roster", { type: "json" })) || [];
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count: roster.length, names: roster.map(r => r.name) })
  };
};
