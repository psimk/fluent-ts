import * as fs from "fs-extra";
import { resolve } from "path";
import chokidar from "chokidar";
import {
  parseTypesFromFTL,
  createOutput,
  diffTypeMaps,
  readTypesFromOut,
  createEmptyType,
  cleanTypeMaps,
} from "./util";

const getWatchedPaths = (watcher: chokidar.FSWatcher): string[] => {
  let paths: string[] = [];

  for (const [path, files] of Object.entries(watcher.getWatched())) {
    paths = [...paths, ...files.map((file) => `${path}/${file}`)];
  }

  return paths;
};

type Options = { outDir?: string; outFilename?: string; noWatch?: boolean };

export default function createWatcher({
  outDir = ".",
  outFilename = "index.d.ts",
  noWatch = false,
}: Options = {}) {
  const watcher = chokidar.watch("./**/*.ftl", { ignored: /node_modules/, ignoreInitial: true });

  const out = resolve(outDir, outFilename);
  fs.ensureFileSync(out);

  const getOutTypes = () => readTypesFromOut(out);
  const write = (source: string) => fs.writeFile(out, source);

  watcher
    .on("ready", async () => {
      // no need to check the out types, we're starting with a clean slate
      write(createOutput(cleanTypeMaps(await parseTypesFromFTL(...getWatchedPaths(watcher)))));

      if (noWatch) {
        watcher.close();
      }
    })
    .on("add", async (path) => {
      // parse types from the .ftl file, the out types, diff them and write to out
      write(createOutput(diffTypeMaps(await parseTypesFromFTL(path), await getOutTypes())));
    })
    .on("change", async (path) => {
      // parse types from the .ftl file, the out types, diff them and write to out
      write(createOutput(diffTypeMaps(await parseTypesFromFTL(path), await getOutTypes())));
    })
    // TODO: doesn't work well when deleting multiple files at the same time, might be because `getOutTypes()` reads the incorrect state at the time
    .on("unlink", async (path) => {
      // pass object with the .ftl type without value (it will get filtered out by the diff), the out types, diff them and write to out
      write(createOutput(diffTypeMaps(createEmptyType(path), await getOutTypes())));
    });

  return () => watcher.close();
}
