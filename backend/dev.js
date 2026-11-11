import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(backendDir, "..");
const viteCli = path.join(projectRoot, "node_modules", "vite", "bin", "vite.js");

const server = spawn(process.execPath, [path.join(backendDir, "server.js")], {
  cwd: projectRoot,
  stdio: "inherit",
  env: process.env,
});
const client = spawn(process.execPath, [viteCli], {
  cwd: projectRoot,
  stdio: "inherit",
  env: process.env,
});

let shuttingDown = false;
const stop = (exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  process.exitCode = exitCode;
  server.kill();
  client.kill();
};

for (const child of [server, client]) {
  child.on("error", (error) => {
    console.error("Could not start development process:", error);
    stop(1);
  });
  child.on("exit", (code) => {
    if (!shuttingDown) stop(code ?? 1);
  });
}

process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
