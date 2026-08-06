// scripts/keep-alive.js
// Exhibition-day supervisor: runs `next start` and automatically respawns it
// if it ever crashes/exits, so a single Node fault doesn't take every
// connected device down for the rest of the day. Plain `npm run start` has
// no supervisor at all — this fills that gap without needing pm2 installed.
//
// Usage: npm run start:watch   (or: node scripts/keep-alive.js)

const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");
const LOG_DIR = path.join(ROOT_DIR, "logs");
const LOG_FILE = path.join(LOG_DIR, "server-supervisor.log");
const BUILD_ID_FILE = path.join(ROOT_DIR, ".next", "BUILD_ID");
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function timestamp() {
  return new Date().toISOString();
}

function log(line) {
  const msg = `[${timestamp()}] ${line}`;
  console.log(msg);
  try {
    fs.appendFileSync(LOG_FILE, msg + "\n");
  } catch (e) {
    // Logging failure should never take down the supervisor itself.
  }
}

const BASE_DELAY_MS = 2000;
const BACKOFF_DELAY_MS = 10000;
const CRASH_WINDOW_MS = 30000;
const CRASH_THRESHOLD = 5;

let recentCrashes = [];
let shuttingDown = false;
let child = null;

// `next start` refuses to run without a prior `next build` (missing/deleted
// .next, or a build interrupted mid-write). Without this check the
// supervisor would just crash-loop forever retrying a command that can
// never succeed. Runs before the first start and before every restart, so
// the app self-heals even if .next gets wiped mid-exhibition.
function ensureBuild() {
  if (fs.existsSync(BUILD_ID_FILE)) return true;

  log("No production build found (.next/BUILD_ID missing) — running `npm run build`...");
  const buildCommand = process.platform === "win32" ? "npm.cmd run build" : "npm run build";
  const result = spawnSync(buildCommand, {
    cwd: ROOT_DIR,
    stdio: "inherit",
    env: process.env,
    shell: true,
  });

  if (result.error || result.status !== 0) {
    log(`Build failed (status=${result.status}). Will retry shortly.`);
    return false;
  }

  log("Build completed successfully.");
  return true;
}

function startServer() {
  if (!ensureBuild()) {
    setTimeout(startServer, BACKOFF_DELAY_MS);
    return;
  }

  log("Starting server (npm run start)...");
  // Windows needs shell:true to run the npm.cmd shim; passed as a single
  // command string (not shell:true + an args array) to avoid Node's
  // unescaped-args deprecation warning, since there's no untrusted input here.
  const command = process.platform === "win32" ? "npm.cmd run start" : "npm run start";
  child = spawn(command, {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
    env: process.env,
    shell: true,
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;

    log(`Server exited (code=${code}, signal=${signal}).`);

    const now = Date.now();
    recentCrashes = recentCrashes.filter((t) => now - t < CRASH_WINDOW_MS);
    recentCrashes.push(now);

    const backingOff = recentCrashes.length >= CRASH_THRESHOLD;
    const delay = backingOff ? BACKOFF_DELAY_MS : BASE_DELAY_MS;

    if (backingOff) {
      log(`WARNING: server has crashed ${recentCrashes.length} times in the last ${CRASH_WINDOW_MS / 1000}s. Backing off — retrying in ${delay / 1000}s. Check ${LOG_FILE} and the app logs above for the root cause.`);
    } else {
      log(`Restarting in ${delay / 1000}s...`);
    }

    setTimeout(startServer, delay);
  });

  child.on("error", (err) => {
    log(`Failed to spawn server process: ${err.message}`);
  });
}

function shutdown(signal) {
  shuttingDown = true;
  log(`Received ${signal}, shutting down supervisor and server...`);
  if (child) child.kill(signal);
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

log("=== Exhibition server supervisor starting ===");
startServer();
