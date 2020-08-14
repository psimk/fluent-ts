export const FLUENT_EXTENSION = ".ftl";

export type CommonFluentTSOptions = {
  outDir?: string;
  outFilename?: string;
};

export const DEFAULT_COMMON_FLUENT_TS_OPTIONS: Required<CommonFluentTSOptions> = {
  outDir: ".",
  outFilename: "index.d.ts",
};
