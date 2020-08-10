# fluent-ts ![.github/workflows/publish.yml](https://github.com/psimk/fluent-ts/workflows/.github/workflows/publish.yml/badge.svg)

`fluent-ts` is a utility for creating typings (`.d.ts` file) from fluent files `.ftl`

## Usage

The loader should execute before `raw-loader`.

```bash
npx fluent-ts --outDir ./node_modules/@types/fluent-ts
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
