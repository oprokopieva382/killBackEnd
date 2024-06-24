/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  //testRegex: "__tests__/e2e/.*.e2e.test.ts$",
  testRegex: "__tests__/integration/.*.integration.test.ts$",
};
