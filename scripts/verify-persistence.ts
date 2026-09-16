import { runPersistenceSmoke } from "./persistence-smoke";

async function main() {
  if (!process.env.DXLAB_SMOKE_URL)
    throw new Error(
      "Set DXLAB_SMOKE_URL to the isolated loopback server. Remote execution is disabled.",
    );
  const result = await runPersistenceSmoke({
    baseUrl: process.env.DXLAB_SMOKE_URL,
  });
  if (result.failures.length) process.exitCode = 1;
  console.log(`Private diagnostics: ${result.directory}`);
}
main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
