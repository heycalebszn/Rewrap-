import { exec } from "child_process";

function fixPermissions() {
  if (process.platform === "win32") {
    console.log("Skipping permission fix on Windows.");
    return;
  }

  exec("sudo chown -R $(whoami) ~/.npm", (error, stdout, stderr) => {
    if (error) {
      console.error(`Permission fix failed: ${stderr}`);
    } else {
      console.log("Permissions fixed successfully.");
    }
  });
}

fixPermissions();
