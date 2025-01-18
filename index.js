#!/usr/bin/env node
import chalk from "chalk";
import path from "path";
import boxen from "boxen";
import gradient from "gradient-string";
import { fileURLToPath } from "url";

import { checkNpmInstalled } from "./src/utils/checkNpm.js";
import { runCommand } from "./src/utils/runCommand.js";

import {
  createComponents,
  updateMainApp,
} from "./library/reactComponentSetup.js";
import cmdPrompts from "./src/utils/cmdPrompts.js";
import setupTailwindCSS from "./library/tailwindSetup.js";

const ensurePackageJsonExists = async (targetDir) => {
  const packageJsonPath = path.join(targetDir, "package.json");

  try {
    await fs.access(packageJsonPath);
    console.log(chalk.green("package.json already exists."));
  } catch {
    console.log(chalk.yellow("package.json not found. Creating a default package.json..."));
    const packageJsonContent = {
      name: path.basename(targetDir),
      version: "1.0.0",
      description: "",
      main: "index.js",
      scripts: {
        dev: "vite",
        build: "vite build",
        lint: "eslint .",
      },
      dependencies: {},
      devDependencies: {},
    };
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));
    console.log(chalk.green("package.json created successfully."));
  }
};

const installDependencies = async (targetDir) => {
  await ensurePackageJsonExists(targetDir); 
  try {
    await runCommand("npm", ["install"], { cwd: targetDir });
    console.log(chalk.green("Dependencies installed successfully."));
  } catch (error) {
    console.error(chalk.red("Error installing dependencies:"), error.message);
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  console.log(
    gradient.pastel.multiline(
      boxen("Rewrap Installer", {
        padding: 1,
        margin: 1,
        borderStyle: "double",
        textAlignment: "center",
      })
    )
  );

  if (!(await checkNpmInstalled())) {
    process.exit(1);
  }

  let { projectName, projectTypeResponse, response, shouldCreateProject } =
    await cmdPrompts();

  if (projectTypeResponse.projectType === "existing") {
    projectName = path.basename(process.cwd());
    shouldCreateProject = false;
  }

  if (shouldCreateProject) {
    projectName = response.projectName;
  }

  const {
    framework,
    language,
    useShadcn,
    iconSet,
    additionalFeatures,
    additionalPackages,
    install,
  } = response;


  if (!install) {
    console.log(chalk.yellow("\nInstallation aborted. Bye! 👋\n"));
    process.exit(0);
  }

  try {
    if (shouldCreateProject) {
      console.log(
        chalk.blue(`\nCreating a new Vite project: ${projectName}...\n`)
      );
      try {
        await runCommand("npm", [
          "create",
          "vite@latest",
          projectName,
          "--",
          "--template",
          `${framework}${language === "typescript" ? "-ts" : ""}`,
        ]);
        process.chdir(projectName);
      } catch (error) {
        console.error(
          chalk.red(
            "Failed to create Vite project. Please try running the following command manually:"
          )
        );
        console.error(
          chalk.cyan(
            `npm create vite@latest ${projectName} -- --template ${framework}${
              language === "typescript" ? "-ts" : ""
            }`
          )
        );
        process.exit(1);
      }
    }

    console.log(chalk.blue("\nInstalling dependencies...\n"));
    await installDependencies(targetDir);

    await setupTailwindCSS();

    if (useShadcn && framework === "react") {
      console.log(chalk.blue("\nInstalling shadcn/ui dependencies...\n"));
      await runCommand("npm", [
        "install",
        "-D",
        "@types/node",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "lucide-react",
        "@radix-ui/react-slot",
      ]);
    }

    if (iconSet !== "none") {
      console.log(chalk.blue(`\nInstalling ${iconSet}...\n`));
      await runCommand("npm", ["install", iconSet]);
    }

    if (additionalPackages.length > 0) {
      console.log(chalk.blue("\nInstalling additional packages...\n"));
      await runCommand("npm", ["install", ...additionalPackages]);
    }

    if (
      additionalFeatures.includes("animations") &&
      !additionalPackages.includes("motion")
    ) {
      console.log(
        chalk.blue(
          "\nInstalling Motion (prev Framer Motion) for animations...\n"
        )
      );
      await runCommand("npm", ["install", "motion"]);
    }

    if (
      additionalFeatures.includes("form") &&
      !additionalPackages.includes("react-hook-form")
    ) {
      console.log(
        chalk.blue("\nInstalling React Hook Form for the sample form...\n")
      );
      await runCommand("npm", ["install", "react-hook-form"]);
    }

    console.log(chalk.blue("\nConfiguring project...\n"));

    // Create components
    await createComponents(additionalFeatures, iconSet);

    // Update main App file
    await updateMainApp(additionalFeatures, iconSet);

    console.log(chalk.green("\nSetup complete! 🎉"));
    console.log(chalk.blue(`\nTo get started:\n`));
    console.log(chalk.cyan(`cd ${projectName}`));
    console.log(chalk.cyan(`npm run dev`));

    console.log(chalk.yellow("\nHelpful tips:"));
    console.log(
      chalk.white("- To create a production build, run: npm run build")
    );
    console.log(chalk.white("- To run tests (if set up), use: npm test"));
    console.log(chalk.white("- To lint your code, use: npm run lint"));
    console.log(chalk.white("- Check package.json for all available scripts"));

    console.log(gradient.rainbow("\n░▒▓█ Happy Coding! █▓▒░"));
  } catch (error) {
    console.error(
      chalk.red("\nAn error occurred during installation:\n"),
      error
    );
    process.exit(1);
  }
})();
