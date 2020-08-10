import createWatcher from ".";

const getArgs = (args: string[]) => {
  const argIndex = args.indexOf("--outDir");

  return {
    outDir: argIndex !== -1 && argIndex + 1 < args.length ? args[argIndex + 1] : undefined,
    watch: args.indexOf("--watch") !== -1,
  };
};

const { outDir, watch } = getArgs(process.argv.slice(2));

if (!outDir) {
  console.log("Please specify the output directory using the `--outDir` argument.");
  process.exit(0);
} else {
  createWatcher({ outDir, noWatch: !watch });
}
