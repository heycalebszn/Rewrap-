import chalk from "chalk";
import { writeFile } from "../src/utils/writeToFile.js";
import { runCommand } from "../src/utils/runCommand.js";

export default async function setupTailwindCSS() {
  console.log(chalk.blue("\nInstalling TailwindCSS...\n"));
  await runCommand("npm", [
    "install",
    "-D",
    "tailwindcss",
    "postcss",
    "autoprefixer", 
  ]);
  await runCommand("npm", ["install", "tailwindcss", "@tailwindcss/vite"]);

  // Configure TailwindCSS
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
           module.exports = {
             darkMode: 'class',
             content: [
               "./index.html",
               "./src/**/*.{js,ts,jsx,tsx}",
             ],
             theme: {
               extend: {
                 colors: {
                   border: "hsl(var(--border))",
                   input: "hsl(var(--input))",
                   ring: "hsl(var(--ring))",
                   background: "hsl(var(--background))",
                   foreground: "hsl(var(--foreground))",
                   primary: {
                     DEFAULT: "hsl(var(--primary))",
                     foreground: "hsl(var(--primary-foreground))",
                   },
                   secondary: {
                     DEFAULT: "hsl(var(--secondary))",
                     foreground: "hsl(var(--secondary-foreground))",
                   },
                   destructive: {
                     DEFAULT: "hsl(var(--destructive))",
                     foreground: "hsl(var(--destructive-foreground))",
                   },
                   muted: {
                     DEFAULT: "hsl(var(--muted))",
                     foreground: "hsl(var(--muted-foreground))",
                   },
                   accent: {
                     DEFAULT: "hsl(var(--accent))",
                     foreground: "hsl(var(--accent-foreground))",
                   },
                   popover: {
                     DEFAULT: "hsl(var(--popover))",
                     foreground: "hsl(var(--popover-foreground))",
                   },
                   card: {
                     DEFAULT: "hsl(var(--card))",
                     foreground: "hsl(var(--card-foreground))",
                   },
                 },
                 borderRadius: {
                   lg: "var(--radius)",
                   md: "calc(var(--radius) - 2px)",
                   sm: "calc(var(--radius) - 4px)",
                 },
               },
             },
             plugins: [],
           }`;

  // Create global CSS file
  const globalCss = `@import "tailwindcss";
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;

const viteConfig = `
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})`

  await writeFile("tailwind.config.js", tailwindConfig);
  await writeFile("./src/index.css", globalCss);
  await writeFile("vite.config.ts", viteConfig);
}
