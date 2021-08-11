import type { Rule, Plugin } from "postcss";
import selectorParser from "postcss-selector-parser";

const preserveCamelCase = (input: string): string => {
  let result = input;
  let isLastCharLower = false;
  let isLastCharUpper = false;
  let isLastLastCharUpper = false;

  for (let i = 0; i < result.length; i++) {
    let character = result[i];

    if (isLastCharLower && /[\p{Lu}]/u.test(character)) {
      result = `${result.slice(0, i)}-${result.slice(i)}`;
      isLastCharLower = false;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = true;
      i += 1;
    } else if (
      isLastCharUpper &&
      isLastLastCharUpper &&
      /[\p{Ll}]/u.test(character)
    ) {
      result = `${result.slice(0, i - 1)}-${result.slice(i - 1)}`;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = false;
      isLastCharLower = true;
    } else {
      isLastCharLower =
        character.toLowerCase() === character &&
        character.toUpperCase() !== character;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper =
        character.toUpperCase() === character &&
        character.toLowerCase() !== character;
    }
  }

  return result;
};

function camelCase(input: string): string {
  let result = input.trim();

  if (result.length === 0) {
    return "";
  }

  if (result.length === 1) {
    return result.toLowerCase();
  }

  let hasUpperCase = result !== result.toLowerCase();

  if (hasUpperCase) {
    result = preserveCamelCase(result);
  }

  return result
    .replace(/^[ ._-]+/, "")
    .toLowerCase()
    .replace(/[_.\- ]+([\p{Alpha}\p{N}_]|$)/gu, (_, p1) => p1.toUpperCase())
    .replace(/\d+([\p{Alpha}\p{N}_]|$)/gu, (m) => m.toUpperCase());
}

const renameNode = (node: selectorParser.ClassName): void => {
  node.value = camelCase(node.value);
};

const selectorProcessor = selectorParser((selectors) =>
  selectors.walkClasses(renameNode)
);

const plugin: Plugin = {
  postcssPlugin: "@abcaustralia/postcss-to-camel-case",
  async Rule(rule: Rule) {
    selectorProcessor.process(rule);
  },
};

export = plugin;
