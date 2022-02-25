const { Parser } = require(".");

const md = new Parser(`# Hello World
 # This will be raw text
#This will also fail
## H2222
[link](https://www.google.com)
Text
Text [uwu](https://www.google.com)]
# Header to [link](https://www.google.com)]`);

console.log(md.parse());
