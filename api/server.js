const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const LOG_DIR = "/root/polymarket-safe-bot-v2/logs";
const BOT_DIR = "/root/polymarket-safe-bot-v2";

app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/bot/status", (req, res) => {
    exec("pgrep -f polymarket.*bot | head -1", (error, stdout) => {
        const isRunning = stdout.trim() !== "";
        res.json({ running: isRunning, pid: isRunning ? parseInt(stdout.trim()) : null });
    });
});

app.get("/bot/stats", (req, res) => {
    const stats = { totalTrades: 0, totalPnl: 0 };
    const tradingLog = LOG_DIR + "/trading.log";
    if (fs.existsSync(tradingLog)) {
        const content = fs.readFileSync(tradingLog, "utf8");
        stats.totalTrades = content.split("\\n").filter(line => line.includes("BUY") || line.includes("SELL")).length;
    }
    res.json(stats);
});

app.listen(PORT, "127.0.0.1", () => {
    console.log("API Server running on http://127.0.0.1:" + PORT);
});
