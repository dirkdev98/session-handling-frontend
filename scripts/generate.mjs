import { App, loadApiStructureFromRemote } from "@compas/code-gen";
import { mainFn, spawn } from "@compas/stdlib";
import Axios from "axios";

mainFn(import.meta, main);

async function main() {
  const app = new App({ verbose: true });

  const fromRemote = await loadApiStructureFromRemote(
    Axios, process.env.NEXT_PUBLIC_API_URL);

  app.extend(fromRemote);

  await app.generate({
                       outputDirectory: "./src/generated",
                       isBrowser: true,
                       enabledGenerators: [ "type", "apiClient", "reactQuery" ]
                     });

  await spawn("yarn", [ "lint" ]);
}
