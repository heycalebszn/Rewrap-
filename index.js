#!/usr/bin/env node

import prompts from 'prompts';
import { execa } from 'execa';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

(async () => {
  console.log(
    chalk.green('\nWelcome to the Vite + TailwindCSS Installer! 🚀\n')
  );

  const response = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'What is your project name?',
      initial: 'vite-tailwind-app',
    },
    {
      type: 'confirm',
      name: 'useShadcn',
      message: 'Would you like to include shadcn/ui components?',
      initial: false,
    },
    {
      type: 'confirm',
      name: 'install',
      message: 'Do you want to install Vite with TailwindCSS?',
      initial: true,
    },
  ]);

  const { projectName, install, useShadcn } = response;

  if (!install) {
    console.log(chalk.yellow('\nInstallation aborted. Bye! 👋\n'));
    process.exit(0);
  }

  try {
    console.log(
      chalk.blue(`\nCreating a new Vite project: ${projectName}...\n`)
    );
    await execa(
      'npm',
      ['create', 'vite@latest', projectName, '--template', 'react'],
      {
        stdio: 'inherit',
      }
    );

    process.chdir(projectName);

    console.log(chalk.blue('\nInstalling dependencies...\n'));
    await execa('npm', ['install'], { stdio: 'inherit' });

    console.log(chalk.blue('\nInstalling TailwindCSS...\n'));
    await execa(
      'npm',
      ['install', '-D', 'tailwindcss', 'postcss', 'autoprefixer'],
      {
        stdio: 'inherit',
      }
    );
    await execa('npx', ['tailwindcss', 'init', '-p'], { stdio: 'inherit' });

    if (useShadcn) {
      console.log(chalk.blue('\nInstalling shadcn/ui dependencies...\n'));
      await execa(
        'npm',
        [
          'install',
          '-D',
          '@types/node',
          'class-variance-authority',
          'clsx',
          'tailwind-merge',
          'lucide-react',
          '@radix-ui/react-slot',
        ],
        { stdio: 'inherit' }
      );

      console.log(chalk.blue('\nInitializing shadcn/ui...\n'));
      const dirs = [
        path.join('src', 'components'),
        path.join('src', 'components', 'ui'),
        path.join('src', 'lib'),
      ];

      dirs.forEach((dir) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      // Add shadcn utility functions
      const utilsContent = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;
      fs.writeFileSync('./src/lib/utils.ts', utilsContent);
    }

    console.log(chalk.blue('\nConfiguring TailwindCSS...\n'));
    const tailwindConfig = useShadcn
      ? `/** @type {import('tailwindcss').Config} */
module.exports = {
darkMode: ["class"],
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
theme: {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    keyframes: {
      "accordion-down": {
        from: { height: 0 },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: 0 },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
    },
  },
},
plugins: [],
}`
      : `/** @type {import('tailwindcss').Config} */
module.exports = {
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
theme: {
  extend: {},
},
plugins: [],
};`;

    fs.writeFileSync('tailwind.config.js', tailwindConfig);

    const stylesContent = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: "Poppins", serif;}
`;
    fs.writeFileSync('./src/index.css', stylesContent);

    console.log(chalk.green('\nSetup complete! 🎉'));
    console.log(chalk.blue(`\nTo get started:\n`));
    console.log(chalk.cyan(`cd ${projectName}`));
    console.log(chalk.cyan(`npm run dev`));
  } catch (error) {
    console.error(
      chalk.red('\nAn error occurred during installation:\n'),
      error
    );
    process.exit(1);
  }
})();
