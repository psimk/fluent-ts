# fluent-ts ![.github/workflows/publish.yml](https://github.com/psimk/fluent-ts/workflows/.github/workflows/publish.yml/badge.svg)

`fluent-ts` is a utility for creating typings (`.d.ts` file) from fluent files `.ftl`

## Usage

> npx

```bash
npx fluent-ts --outDir ./node_modules/@types/fluent-ts
```

> yarn

```bash
yarn create fluent-ts --outDir ./node_modules/@types/fluent-ts
```

It is also possible to run the command in `watch` mode, using the `--watch` argument:

```bash
npx fluent-ts --outDir . --watch
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
