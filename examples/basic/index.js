const fluentContext = require.context("./", true, /\.ftl$/);

fluentContext.keys().map((file) => fluentContext(file).default);

console.log("hey");
console.log("hey");
