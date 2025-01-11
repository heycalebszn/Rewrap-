#!/usr/bin/env node

import prompts from "prompts";
import { execa } from "execa";
import chalk from "chalk"

(async () => {
  console.log(chalk.green("\nWelcome to the Vite + TailwindCSS Installer! 🚀\n"));

  const response = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "What is your project name?",
      initial: "vite-tailwind-app",
    },
    {
      type: "confirm",
      name: "install",
      message: "Do you want to install Vite with TailwindCSS?",
      initial: true,
    },
  ]);

  const { projectName, install } = response;

  if (!install) {
    console.log(chalk.yellow("\nInstallation aborted. Bye! 👋\n"));
    process.exit(0);
  }

  try {
    console.log(chalk.blue(`\nCreating a new Vite project: ${projectName}...\n`));
    await execa("npm", ["create", "vite@latest", projectName, "--template", "react"], {
      stdio: "inherit",
    });

    process.chdir(projectName);

    console.log(chalk.blue("\nInstalling dependencies...\n"));
    await execa("npm", ["install"], { stdio: "inherit" });

    console.log(chalk.blue("\nInstalling TailwindCSS...\n"));
    await execa("npm", ["install", "-D", "tailwindcss", "postcss", "autoprefixer"], {
      stdio: "inherit",
    });
    await execa("npx", ["tailwindcss", "init", "-p"], { stdio: "inherit" });

    console.log(chalk.blue("\nConfiguring TailwindCSS...\n"));
    const fs = require("fs");
    const tailwindConfig = `
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
    fs.writeFileSync("tailwind.config.js", tailwindConfig);

    const stylesContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;
    fs.writeFileSync("./src/index.css", stylesContent);

    console.log(chalk.green("\nSetup complete! 🎉"));
    console.log(chalk.blue(`\nTo get started:\n`));
    console.log(chalk.cyan(`cd ${projectName}`));
    console.log(chalk.cyan(`npm run dev`));
  } catch (error) {
    console.error(chalk.red("\nAn error occurred during installation:\n"), error);
    process.exit(1);
  }
})();
