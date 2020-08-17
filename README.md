# fluent-ts ![.github/workflows/publish.yml](https://github.com/psimk/fluent-ts/workflows/.github/workflows/publish.yml/badge.svg)

A CLI/Webpack Plugin - utility for creating typings (`.d.ts` file) for fluent files `.ftl`.

## Install

```bash
npm i --save-dev fluent-ts
```

```bash
yarn add -D fluent-ts
```

This utility simplifies Fluent integration within TypeScript projects, providing with a single global `FluentId` type that is a concatenation of all the Fluent message ids. This is not only useful in checking if the Fluent id used in code, is indeed defined in an `.ftl` file, but also in speeding up development by providing the same Fluent ids via text editor auto-completion.

## CLI

Will search the current directory for `.ftl` files and will output a single `.d.ts` containing the fluent message ids represented as TS types.

```bash
# or npm or npx or yarn create
yarn fluent-ts --outDir ./node_modules/@types/fluent-ts
```

It is also possible to run the command in `watch` mode, using the `--watch` argument:

```bash
npx fluent-ts --outDir . --watch
```

## Webpack Plugin

Will search the webpack context for `.ftl` files and will output a single `.d.ts` containing the fluent message ids represented as TS types.

Running webpack in watch mode, whenever a `.ftl` file changes or is removed, then these changes will be immediately present in the `.d.ts` file.

**webpack.config.js**

```js
const FluentTSWebpackPlugin = require("fluent-ts/plugin");

module.exports = {
  entry: "index.js",
  output: {
    path: __dirname + "/dist",
    filename: "index_bundle.js",
  },
  plugins: [new FluentTSWebpackPlugin()],
};
```

|       Name        |    Type    |   Default    | Description                               |
| :---------------: | :--------: | :----------: | :---------------------------------------- |
|   **`outDir`**    | `{String}` |     `.`      | The output directory for the `.d.ts` file |
| **`outFilename`** | `{String}` | `index.d.ts` | The name of the `.d.ts` file              |

## License

[MIT](https://choosealicense.com/licenses/mit/)
