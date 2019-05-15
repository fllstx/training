"use strict";
const { describe, it, equals } = require("./framework");

describe("basic calculations", function() {
  it("should add two numbers", function() {
    const r = 1 + 1;
    equals(2, r);
  });

  it("should add two numbers", function() {
    const r = 2 + 1;
    equals(2, r);
  });
});
