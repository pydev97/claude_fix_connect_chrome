Problem: Claude Code v2.1.92 on Windows always uses the WebSocket bridge (wss://bridge.claudeusercontent.com) instead
of the local named pipe, causing the Chrome extension to fail connecting.

Root cause: The c41 function in cli.js prioritizes bridgeConfig (WebSocket bridge) over the local socket:
// Before patch
function c41(q){return q.bridgeConfig?OY8(q):q.getSocketPaths?yV7(q):\_Y8(q)}

// After patch — skip bridgeConfig, use local socket
function c41(q){return q.getSocketPaths?yV7(q):\_Y8(q)}

How to fix:

1. Clone this repo
2. Run the patch:
   node fix-chrome-bridge.js
3. Restart Claude Code

Revert if needed:
node fix-chrome-bridge.js --uninstall

▎ Note: Every time npm install -g @anthropic-ai/claude-code updates to a new version, the patch needs to be
re-applied. If the new version renames the c41 function, the script will error with "Target function not found"
instead of silently patching incorrectly.
