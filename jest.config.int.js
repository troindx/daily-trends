module.exports = {
  testRegex: "\\.spec\\.int\\.ts$",
  testTimeout: 7000,
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
};