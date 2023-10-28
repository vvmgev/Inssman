const fs = require('fs');
const path = require('path');

const outputDir = path.resolve(__dirname, "../", "dist")
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
  console.log(`Removed the ${outputDir} folder`);
} else {
  console.log(`The ${outputDir} is not exist`);
}
