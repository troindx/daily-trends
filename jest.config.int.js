module.exports = {
  testRegex: "\\.spec\\.int\\.ts$",
  testTimeout: 7000,
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  silent: true,
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
};