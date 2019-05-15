const { describe, it, equals } = require("./../../test-framework/framework");
const { caesarChipher } = require("./caesar");

describe("caesar chipher", () => {
  const testData = [{ input: "ab", shift: 1, output: "bc" }];
  const testData = [{ input: "KrautIpsum", shift: -1, output: "JqztHortl" }];

  testData.forEach(testDataItem => {
    it(`should test the caesarChipher function with value "input:${
      testDataItem.input
    } and "shift:${testDataItem.shift}"`, () => {
      const r = caesarChipher(testDataItem.input, testDataItem.shift);
      equals(testDataItem.output, r);
    });
  });
});
