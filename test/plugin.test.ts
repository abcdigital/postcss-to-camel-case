import dedent from "dedent";
import plugin = require("../src");
import postcss, { Result } from "postcss";

const postcssProcess = async (input: string): Promise<Result> =>
  postcss([plugin]).process(input, { from: undefined });

const assertWithNoWarnings = (result: Result, output: string): void => {
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
};

describe("postcss-to-camel-case", () => {
  it("handles basic css syntax", async () => {
    const INPUT = `.full-height .Block_Element--Modifier, .image.full-width {}`;
    const OUTPUT = `.fullHeight .blockElementModifier, .image.fullWidth {}`;

    assertWithNoWarnings(await postcssProcess(INPUT), OUTPUT);
  });

  describe("handles strange selectors", () => {
    const expectPairs = [
      [".class", ".class"],
      [".class-name", ".className"],
      [".cla-ssn-ame", ".claSsnAme"],
      [".class--name", ".className"],
      [".--class-name", ".className"],
      [".--class---name", ".className"],
      [".CLASS-NAME", ".className"],
      [".çlass-NAMe", ".\\E7lassNaMe"],
      [".--class---name--", ".className"],
      [".--class--5", ".class5"],
      [".--class..name", ".class..name"],
      [".class_name", ".className"],
      [".__class__name__", ".className"],
      [".class name", ".class name"],
      [".  class  name ", ".  class  name "],
      [".-", ".-"],
      [".className", ".className"],
      [".className-post", ".classNamePost"],
      [".classNamePost-", ".classNamePost"],
      [".", "."],
      [".--__--_--_", "."],
      [".A::a", ".a::a"],
      [".1Hello", ".\\31Hello"],
      [".h2w", ".h2W"],
      [".F", ".f"],
      [".class name?", ".class name?"],
      [".class name!", ".class name!"],
      [".class name#", ".class name#"],
      [".Name1Class11class", ".name1Class11Class"],
    ];

    for (const [INPUT, OUTPUT] of expectPairs) {
      it(`should transform ${INPUT} to ${OUTPUT}`, async () => {
        assertWithNoWarnings(
          await postcssProcess(`${INPUT} {}`),
          `${OUTPUT} {}`
        );
      });
    }
  });

  it("handles scss style nesting", async () => {
    const INPUT = dedent`.Block_Element--Modifier {
      .nested-class {
        .Further_Nested--Modifier:hover {
          color: blue;
        }
      }
    }`;
    const OUTPUT = dedent`.blockElementModifier {
      .nestedClass {
        .furtherNestedModifier:hover {
          color: blue;
        }
      }
    }`;
    assertWithNoWarnings(await postcssProcess(INPUT), OUTPUT);
  });
});
