import prepareDatabase from "./global-setup";

prepareDatabase().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
