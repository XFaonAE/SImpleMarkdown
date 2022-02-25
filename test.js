const { Parser } = require(".");
const fs = require("fs/promises");
const path = require("path");

(async () => {
    const md = new Parser(await fs.readFile("./test.ckit", "utf8"));
    const parsed = md.parse();

    console.log(parsed);
    fs.writeFile(path.join(__dirname, "./test.ckit.mjs"), parsed, "utf8");
})();
