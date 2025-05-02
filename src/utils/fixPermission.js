import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const npmCachePath = execSync("npm config get cache").toString().trim();
const testPath = path.join(npmCachePath, "_test_write");

try {
  fs.writeFileSync(testPath, "test");
  fs.unlinkSync(testPath);
} catch (err) {
  console.error("\n🚨 Permission Issue Detected! 🚨");
  console.error("Your npm cache folder has incorrect permissions.");
  console.error("To fix this, run the following command:");
  console.log("\n  sudo chown -R $(whoami) ~/.npm\n");
  console.error("Then retry installing the package.\n");
  process.exit(1);
}