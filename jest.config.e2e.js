module.exports = {
  testRegex: "\\.spec\\.e2e\\.ts$",
  testTimeout: 7000,
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  silent:true,
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
};