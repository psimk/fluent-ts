import { basename, extname } from "path";
import pascalCase from "pascalcase";

export const toDeclaration = (
  name: string,
  value: string,
  { newLine = false, declare = false }: { newLine?: boolean; declare?: boolean }
) => {
  const declareString = declare ? "declare " : "";
  const newLineString = newLine ? "\n" : "";

  return `${declareString}type ${name} = ${value};${newLineString}`;
};

// convert message identifiers to output format of `'id-1' | 'id-2' | ...`
export const toValue = (values: string[]) => values.map((v) => `'${v}'`).join(" | ");

export const fileToType = (file: string): string => pascalCase(basename(file, extname(file)));
