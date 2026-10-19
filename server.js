require("dotenv").config();
const express = require("express");
const path = require("path");
const { startBot, requestPairing, stopBot, getBotStatus } = require("./src/bot");

const app = express();
const PORT = Number(process.env.PORT || 3000);
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

function authorized(req) {
  const expected = process.env.BOT_ADMIN_TOKEN;
  const supplied = req.get("x-admin-token") || req.body?.token || "";
  return Boolean(expected && expected !== "replace-with-a-long-random-secret" && supplied &&
    supplied.length === expected.length &&
    require("crypto").timingSafeEqual(Buffer.from(supplied), Buffer.from(expected)));
}
function requireAdmin(req, res, next) {
  if (!authorized(req)) return res.status(401).json({ ok: false, error: "Invalid or missing admin token." });
  next();
}
app.get("/health", (_req, res) => res.json({ ok: true, service: "BDS BOT", timestamp: new Date().toISOString() }));
app.get("/api/status", (_req, res) => res.json(getBotStatus()));
app.post("/api/pair", requireAdmin, async (req, res) => {
  const phone = String(req.body?.phone || "").replace(/\D/g, "");
  if (!/^\d{8,15}$/.test(phone)) return res.status(400).json({ ok: false, error: "Enter a phone number with country code, digits only (8–15 digits)." });
  try {
    const code = await requestPairing(phone);
    res.json({ ok: true, code, message: "Enter this code in WhatsApp → Linked devices → Link a device → Link with phone number." });
  } catch (err) {
    res.status(503).json({ ok: false, error: err.message || "Pairing could not be started. Check server logs and try again." });
  }
});
app.post("/api/disconnect", requireAdmin, async (_req, res) => {
  try { await stopBot(); res.json({ ok: true, status: getBotStatus() }); }
  catch (_e) { res.status(500).json({ ok: false, error: "Could not disconnect cleanly." }); }
});
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`BDS BOT dashboard listening on port ${PORT}`);
  startBot().catch(err => console.error("Bot startup error:", err.message));
});
function shutdown() {
  server.close(() => process.exit(0));
  stopBot().catch(() => process.exit(1));
  setTimeout(() => process.exit(1), 8000).unref();
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
