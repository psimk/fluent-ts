import webpack from "webpack";
import { EventEmitter } from "events";
import { extname } from "path";
import { FLUENT_EXTENSION } from "./constants";

interface Watcher extends EventEmitter {
  mtimes: Record<string, number>;
}

export const getWatcher = (compiler: webpack.Compiler): Watcher | null => {
  // webpack 4
  const { watchFileSystem } = compiler as any;

  return watchFileSystem?.watcher ?? watchFileSystem?.wfs?.watcher ?? null;
};

export const filterFluentFiles = (files: string[]) =>
  files.filter((file) => Boolean(file) && extname(file) === FLUENT_EXTENSION);

export const getWatcherFluentFiles = (compiler: webpack.Compiler): string[] =>
  filterFluentFiles(Object.keys(getWatcher(compiler)?.mtimes ?? {}));
