import webpack from "webpack";
import {
  format,
  webpack as utils,
  readTypesFromOut,
  constants,
  createOutput,
  cleanTypeMaps,
  parseTypesFromFTL,
  diffTypeMaps,
} from "./utils";
import { resolve } from "path";
import * as fs from "fs-extra";
import intersection from "lodash/intersection";
import { pick } from "lodash";

type FluentTSWebpackPluginOptions = constants.CommonFluentTSOptions;

export default class FluentTSWebpackPlugin {
  private options: Required<FluentTSWebpackPluginOptions>;

  constructor(options: FluentTSWebpackPluginOptions = constants.DEFAULT_COMMON_FLUENT_TS_OPTIONS) {
    this.options = { ...constants.DEFAULT_COMMON_FLUENT_TS_OPTIONS, ...options } as Required<
      FluentTSWebpackPluginOptions
    >;
  }

  apply(compiler: webpack.Compiler) {
    const { outDir, outFilename } = this.options;

    const out = resolve(outDir, outFilename);
    fs.ensureFileSync(out);

    const getOutTypes = () => readTypesFromOut(out);
    const write = (source: string) => fs.writeFile(out, source);

    let initial = true;

    compiler.hooks.emit.tapAsync(FluentTSWebpackPlugin.name, async (compilation, callback) => {
      const allFluentFiles = utils
        .filterFluentFiles(
          compilation.chunks.flatMap((chunk) =>
            chunk
              .getModules()
              .flatMap(
                (module: webpack.compilation.Module & { rawRequest?: string }) => module.rawRequest
              )
          )
        )
        // adds the full path to the file, so it's of the exact same format
        // as the watcher files below
        .map((file) => resolve(compiler.context, file));

      if (initial) {
        // initial run, so create all types from scratch
        write(createOutput(cleanTypeMaps(await parseTypesFromFTL(...allFluentFiles))));
      } else {
        // these are the changed/deleted files caught by the watcher
        const watcherFluentFiles = utils.getWatcherFluentFiles(compiler);

        // make sure that we only run this when there are changes
        if (watcherFluentFiles.length) {
          const changedFluentFiles = intersection(allFluentFiles, watcherFluentFiles);

          write(
            createOutput(
              diffTypeMaps(
                await parseTypesFromFTL(...changedFluentFiles),
                // "pick" will make sure that we only take the types, which match `allFluentFiles`
                pick(await getOutTypes(), allFluentFiles.map(format.fileToType))
              )
            )
          );
        }
      }

      initial = false;

      callback();
    });
  }
}
