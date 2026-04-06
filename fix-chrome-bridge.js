//fix - chrome - bridge.js;
// Run with: node fix-chrome-bridge.js
// Revert:   node fix-chrome-bridge.js --uninstall

const fs = require("fs");
const path = require("path");

const cliPath = path.join(
  process.env.APPDATA,
  "npm",
  "node_modules",
  "@anthropic-ai",
  "claude-code",
  "cli.js",
);
const backupPath = cliPath + ".bak";

const ORIGINAL =
  "function c41(q){return q.bridgeConfig?OY8(q):q.getSocketPaths?yV7(q):_Y8(q)}";
const PATCHED = "function c41(q){return q.getSocketPaths?yV7(q):_Y8(q)}";

if (!fs.existsSync(cliPath)) {
  console.error("cli.js not found at:", cliPath);
  process.exit(1);
}

if (process.argv.includes("--uninstall")) {
  if (!fs.existsSync(backupPath)) {
    console.error("No backup found at:", backupPath);
    process.exit(1);
  }
  fs.copyFileSync(backupPath, cliPath);
  fs.unlinkSync(backupPath);
  console.log("Reverted cli.js from backup.");
  process.exit(0);
}

const content = fs.readFileSync(cliPath, "utf8");

if (content.includes(PATCHED)) {
  console.log("Already patched. Run with --uninstall to revert.");
  process.exit(0);
}

if (!content.includes(ORIGINAL)) {
  console.error(
    "Target function not found. Patch may not be compatible with this version.",
  );
  process.exit(1);
}

// Backup
fs.copyFileSync(cliPath, backupPath);
console.log("Backup saved:", backupPath);

// Patch
const newContent = content.replace(ORIGINAL, PATCHED);
fs.writeFileSync(cliPath, newContent, "utf8");

console.log(
  "Patch applied. WebSocket bridge disabled, local socket will be used.",
);
console.log("Restart Claude Code to apply changes.");
