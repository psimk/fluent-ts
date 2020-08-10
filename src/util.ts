import { parse as fluentParse, Message } from "@fluent/syntax";
import * as format from "./format";
import dedent from "dedent";
import * as fs from "fs-extra";
import { type } from "os";

type FluentTypeMap = Record<string, string>;

const getFluentTypes = (path: string, source: string): FluentTypeMap => {
  // parse out message identifiers
  const { body } = fluentParse(String(source), {});
  const messages = body.filter(({ type }) => type === "Message") as Message[];

  return { [format.fileToType(path)]: format.toValue(messages.map(({ id }) => id.name)) };
};

export const parseTypesFromFTL = async (...paths: string[]) => {
  let types: FluentTypeMap = {};

  for (const path of paths) {
    types = { ...types, ...getFluentTypes(path, String(await fs.readFile(path))) };
  }

  return types;
};

export const readTypesFromOut = async (path: string) => {
  const types: FluentTypeMap = {};

  const typePairs = String(await fs.readFile(path)).match(/(\w+)\s={1}\s(\'.+\')/g) ?? [];

  for (const pair of typePairs) {
    const [name, type] = pair.split(" = ");
    types[name] = type;
  }

  return types;
};

export const cleanTypeMaps = (types: FluentTypeMap): FluentTypeMap =>
  Object.fromEntries(
    Object.entries(types).filter(([name, type]) => Boolean(name) && Boolean(type))
  );

export const diffTypeMaps = (changes: FluentTypeMap, old: FluentTypeMap): FluentTypeMap =>
  cleanTypeMaps({ ...old, ...changes });

export const createEmptyType = (file: string) => ({ [format.fileToType(file)]: "" });

const isLast = (index: number, arr: any[]) => index === arr.length - 1;

export const createOutput = (
  types: FluentTypeMap,
  { globalTypeName = "FluentId" }: { globalTypeName?: string } = {}
): string => {
  const typeNames = Object.keys(types).sort((a, b) => a.localeCompare(b));

  return dedent`
          /** AUTO GENERATED, DO NOT EDIT */

          ${typeNames
            .map((name, ...rest) =>
              format.toDeclaration(name, types[name], { newLine: !isLast(...rest) })
            )
            .join("")}

          ${format.toDeclaration(
            globalTypeName.trim(),
            typeNames.length ? typeNames.join(" | ") : "never",
            {
              declare: true,
            }
          )}
          `;
};
