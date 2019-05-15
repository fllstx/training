const { describe, it, equals } = require("./../../test-framework/framework");
const { validParentheses } = require("./parentheses");

describe("parentheses", () => {
  const testData = [
    { str: "()", isValid: true },
    { str: "(()", isValid: false },
    { str: "((()())()()))))))", isValid: false }
  ];

  testData.forEach(testDataItem => {
    it(`should test the validParentheses function with value "${
      testDataItem.str
    }"`, () => {
      const r = validParentheses(testDataItem.str);
      equals(testDataItem.isValid, r);
    });
  });
});
