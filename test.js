const { Parser } = require(".");

const md = new Parser(`Kit::meow("Hello, World!"); // Meow!
// Uwu
asdasdadasdasd // Some comment and resss 
`);

console.log(md.parse());
