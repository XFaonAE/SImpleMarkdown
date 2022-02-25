const { Parser } = require(".");
const fs = require("fs/promises");
const path = require("path");

(async () => {
    const md = new Parser(await fs.readFile("./test.ckit", "utf8"));
    fs.writeFile("./test.ckit.mjs", "");
    
    let res = "";

    md.on('write', (strs) => {
        // Append to a file
        res += strs;
    });

    const parsed = md.parse();
    console.log("\n" + parsed);

    fs.writeFile("./test.ckit.mjs", res);
})();
