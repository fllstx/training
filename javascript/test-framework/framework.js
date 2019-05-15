const testResultMessageIndent = "  ";
const consoleColors = {
  red: "\x1b[31m%s\x1b[0m",
  green: "\x1b[32m%s\x1b[0m",
  reset: "\x1b[0m"
};
let testSuiteObject = {
  tests: []
};

function logSuccessTestResult(message) {
  logTestResult(message, consoleColors.green);
}

function logErrorTestResult(message) {
  logTestResult(message, consoleColors.red);
}
function logTestResult(message, color) {
  console.log(color, `${testResultMessageIndent} ${message}`);
}

function describe(name, testSuite) {
  testSuiteObject = {
    tests: []
  };

  testSuiteObject.time = Date.now();

  // 1. Parse test suite
  testSuite.call(this);

  console.log(
    `\n\nRunning suite (${testSuiteObject.tests.length} tests) ${name}\n`
  );

  // 2. Execute all tests
  testSuiteObject.tests.forEach(testObject => {
    testObject.passed = _it(testObject);
  });

  testSuiteObject.time = (Date.now() - testSuiteObject.time) / 1000;

  console.log(
    `Executed ${testSuiteObject.tests.length} tests in ${
      testSuiteObject.time
    } seconds.\n`
  );
}

function it(name, testFunction) {
  parseIt.call(testSuiteObject, name, testFunction);
}

function parseIt(name, testFunction) {
  this.tests.push({
    name: name,
    testFunction: testFunction,
    passed: undefined
  });
}

function _it({ name, testFunction }) {
  try {
    testFunction();
    logSuccessTestResult(`it ${name} \u2713\n`);
    return true;
  } catch (err) {
    logErrorTestResult(`it ${name} \u2717`);
    logErrorTestResult(`${err.message}\n`);
    return false;
  }
}

function equals(expected, actual) {
  if (expected === actual) {
    return true;
  } else {
    throw new Error(`expected: ${expected} actual: ${actual}`);
  }
}

module.exports.describe = describe;
module.exports.it = it;
module.exports.equals = equals;
