module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/*.test.ts"],
  reporters: ["default", "jest-summary-reporter"],
  collectCoverage: false,
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};
