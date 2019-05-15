const { describe, it, equals } = require("./../../test-framework/framework");
const { isIsogram } = require("./isograms");

describe("isograms", () => {
  const testData = [
    { str: "", isIsogram: true },
    { str: "abba", isIsogram: false },
    { str: "consumptively", isIsogram: true }
  ];

  testData.forEach(testDataItem => {
    it(`should test the isIsogram funciton with value "${
      testDataItem.str
    }"`, () => {
      const r = isIsogram(testDataItem.str);
      equals(testDataItem.isIsogram, r);
    });
  });
});
