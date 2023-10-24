const fs = require('fs');
const path = require('path');
const archiver = require("archiver");
const { version } = require('../package.json');
const outputDir = path.resolve(__dirname, "../", "release")
const fileName = `inssman-${process.env.BROWSER}-${version}.zip`;

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
const output = fs.createWriteStream(path.join(outputDir, fileName));
const archive = archiver("zip");
output.on("close", () => archive.pointer());
archive.on("error", (err) => {throw err});
archive.pipe(output);
archive.directory(`./dist/${process.env.BROWSER}`, false);
archive.finalize();
