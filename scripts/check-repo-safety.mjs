import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

const tracked = new Set(git(["ls-files"]).split(/\r?\n/).filter(Boolean));
if (tracked.has(".env")) throw new Error(".env must never be tracked");
if (!tracked.has(".env.example"))
  throw new Error(".env.example must be tracked");

try {
  git(["check-ignore", ".env"]);
} catch {
  throw new Error(".env must be covered by an ignore rule");
}

if (git(["diff", "--cached", "--name-only", "--", ".env"]))
  throw new Error(".env must not be staged");

const example = readFileSync(".env.example", "utf8");
for (const line of example.split(/\r?\n/)) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (!match) continue;
  const [, key, rawValue] = match;
  const value = rawValue.replace(/^['"]|['"]$/g, "");
  if (key === "DATABASE_URL" && value !== "file:./dev.db")
    throw new Error("DATABASE_URL example must use the local placeholder");
  if (/(PASSWORD|TOKEN|SECRET|API_KEY|PRIVATE_KEY)$/.test(key) && value)
    throw new Error(`${key} must not contain a real or placeholder credential`);
}

console.log("Repository safety checks passed.");
