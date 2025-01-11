#!/usr/bin/env node

import prompts from 'prompts';
import { execa } from 'execa';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import ora from 'ora';
import boxen from 'boxen';
import gradient from 'gradient-string';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runCommand(command, args, options = {}) {
  const spinner = ora(`Running: ${command} ${args.join(' ')}`).start();
  try {
    const { stdout, stderr } = await execa(command, args, { ...options, stdio: 'pipe' });
    spinner.succeed();
    return { stdout, stderr };
  } catch (error) {
    spinner.fail();
    console.error(chalk.red(`Error running ${command}:`));
    console.error(chalk.red(error.message));
    if (error.stdout) console.error(chalk.yellow('stdout:', error.stdout));
    if (error.stderr) console.error(chalk.yellow('stderr:', error.stderr));
    throw error;
  }
}

async function writeFile(filePath, content) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
  } catch (error) {
    console.error(chalk.red(`Error writing to ${filePath}:`), error);
    throw error;
  }
}

async function checkNpmInstalled() {
  try {
    await execa('npm', ['--version']);
    return true;
  } catch (error) {
    console.error(chalk.red('npm is not installed or not accessible. Please install npm and try again.'));
    return false;
  }
}

(async () => {
  console.log(
    gradient.pastel.multiline(boxen('Rewrap Installer', {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      textAlignment: 'center',
    }))
  );

  if (!(await checkNpmInstalled())) {
    process.exit(1);
  }

  const projectTypeResponse = await prompts({
    type: 'select',
    name: 'projectType',
    message: 'Is this a new project or an existing project?',
    choices: [
      { title: 'New Project', value: 'new' },
      { title: 'Existing Project', value: 'existing' },
    ],
    initial: 0,
  });

  let projectName;
  let shouldCreateProject = true;

  if (projectTypeResponse.projectType === 'existing') {
    projectName = path.basename(process.cwd());
    shouldCreateProject = false;
  }

  const response = await prompts([
    ...(shouldCreateProject ? [{
      type: 'text',
      name: 'projectName',
      message: 'What is your project name?',
      initial: 'rewrap-app',
    }] : []),
    {
      type: 'select',
      name: 'framework',
      message: 'Which framework would you like to use?',
      choices: [
        { title: 'React', value: 'react' },
        { title: 'Vue', value: 'vue' },
        { title: 'Svelte', value: 'svelte' },
      ],
      initial: 0,
    },
    {
      type: 'select',
      name: 'language',
      message: 'Which language would you like to use?',
      choices: [
        { title: 'JavaScript', value: 'javascript' },
        { title: 'TypeScript', value: 'typescript' },
      ],
      initial: 1,
    },
    {
      type: 'confirm',
      name: 'useShadcn',
      message: 'Would you like to include shadcn/ui components? (React only)',
      initial: true,
    },
    {
      type: 'select',
      name: 'iconSet',
      message: 'Which icon set would you like to use?',
      choices: [
        { title: 'Lucide', value: 'lucide-react' },
        { title: 'Font Awesome', value: '@fortawesome/fontawesome-svg-core' },
        { title: 'Heroicons', value: '@heroicons/react' },
      ],
      initial: 0,
    },
    {
      type: 'multiselect',
      name: 'additionalFeatures',
      message: 'Select additional features to include:',
      choices: [
        { title: 'Dark Mode', value: 'darkMode' },
        { title: 'Responsive Sidebar', value: 'sidebar' },
        { title: 'Sample Form', value: 'form' },
        { title: 'Animations', value: 'animations' },
      ],
    },
    {
      type: 'multiselect',
      name: 'additionalPackages',
      message: 'Select additional packages to install:',
      choices: [
        { title: 'React Router', value: 'react-router-dom' },
        { title: 'Axios', value: 'axios' },
        { title: 'Redux Toolkit', value: '@reduxjs/toolkit' },
        { title: 'React Query', value: 'react-query' },
        { title: 'Framer Motion', value: 'framer-motion' },
        { title: 'React Hook Form', value: 'react-hook-form' },
      ],
    },
    {
      type: 'confirm',
      name: 'install',
      message: 'Do you want to proceed with the installation?',
      initial: true,
    },
  ]);

  if (shouldCreateProject) {
    projectName = response.projectName;
  }

  const { framework, language, useShadcn, iconSet, additionalFeatures, additionalPackages, install } = response;

  if (!install) {
    console.log(chalk.yellow('\nInstallation aborted. Bye! 👋\n'));
    process.exit(0);
  }

  try {
    if (shouldCreateProject) {
      console.log(chalk.blue(`\nCreating a new Vite project: ${projectName}...\n`));
      try {
        await runCommand('npm', ['create', 'vite@latest', projectName, '--', '--template', `${framework}${language === 'typescript' ? '-ts' : ''}`]);
        process.chdir(projectName);
      } catch (error) {
        console.error(chalk.red('Failed to create Vite project. Please try running the following command manually:'));
        console.error(chalk.cyan(`npm create vite@latest ${projectName} -- --template ${framework}${language === 'typescript' ? '-ts' : ''}`));
        process.exit(1);
      }
    }

    console.log(chalk.blue('\nInstalling dependencies...\n'));
    await runCommand('npm', ['install']);

    console.log(chalk.blue('\nInstalling TailwindCSS...\n'));
    await runCommand('npm', ['install', '-D', 'tailwindcss', 'postcss', 'autoprefixer']);
    await runCommand('npx', ['tailwindcss', 'init', '-p']);

    if (useShadcn && framework === 'react') {
      console.log(chalk.blue('\nInstalling shadcn/ui dependencies...\n'));
      await runCommand('npm', [
        'install',
        '-D',
        '@types/node',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'lucide-react',
        '@radix-ui/react-slot',
      ]);
    }

    if (iconSet !== 'none') {
      console.log(chalk.blue(`\nInstalling ${iconSet}...\n`));
      await runCommand('npm', ['install', iconSet]);
    }

    if (additionalPackages.length > 0) {
      console.log(chalk.blue('\nInstalling additional packages...\n'));
      await runCommand('npm', ['install', ...additionalPackages]);
    }

    if (additionalFeatures.includes('animations') && !additionalPackages.includes('framer-motion')) {
      console.log(chalk.blue('\nInstalling Framer Motion for animations...\n'));
      await runCommand('npm', ['install', 'framer-motion']);
    }

    if (additionalFeatures.includes('form') && !additionalPackages.includes('react-hook-form')) {
      console.log(chalk.blue('\nInstalling React Hook Form for the sample form...\n'));
      await runCommand('npm', ['install', 'react-hook-form']);
    }

    console.log(chalk.blue('\nConfiguring project...\n'));

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
    await writeFile('tailwind.config.js', tailwindConfig);

    // Create global CSS file
    const globalCss = `@tailwind base;
@tailwind components;
@tailwind utilities;
 
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
    await writeFile('./src/index.css', globalCss);

    // Create components
    await createComponents(additionalFeatures, iconSet);

    // Update main App file
    await updateMainApp(additionalFeatures, iconSet);

    console.log(chalk.green('\nSetup complete! 🎉'));
    console.log(chalk.blue(`\nTo get started:\n`));
    console.log(chalk.cyan(`cd ${projectName}`));
    console.log(chalk.cyan(`npm run dev`));

    console.log(chalk.yellow('\nHelpful tips:'));
    console.log(chalk.white('- To create a production build, run: npm run build'));
    console.log(chalk.white('- To run tests (if set up), use: npm test'));
    console.log(chalk.white('- To lint your code, use: npm run lint'));
    console.log(chalk.white('- Check package.json for all available scripts'));

    console.log(gradient.rainbow('\n░▒▓█ Happy Coding! █▓▒░'));

  } catch (error) {
    console.error(chalk.red('\nAn error occurred during installation:\n'), error);
    process.exit(1);
  }
})();

async function createComponents(additionalFeatures, iconSet) {
  // Create Layout component
  const layoutContent = `import React from 'react';
${additionalFeatures.includes('sidebar') ? "import Sidebar from './Sidebar';" : ''}
${additionalFeatures.includes('darkMode') ? "import { useTheme } from './ThemeProvider';" : ''}
${iconSet === 'lucide-react' ? "import { Sun, Moon } from 'lucide-react';" : ''}
${iconSet === '@fortawesome/fontawesome-svg-core' ? "import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';\nimport { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';" : ''}
${iconSet === '@heroicons/react' ? "import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';" : ''}

export const Layout = ({ children }) => {
  ${additionalFeatures.includes('darkMode') ? "const { theme, toggleTheme } = useTheme();" : ''}
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-primary text-primary-foreground shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Rewrap App</h1>
          ${additionalFeatures.includes('darkMode') ? `
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-primary-foreground/10">
            ${iconSet === 'lucide-react' ? 
              "theme === 'dark' ? <Sun className='w-6 h-6' /> : <Moon className='w-6 h-6' />" :
              iconSet === '@fortawesome/fontawesome-svg-core' ?
              "theme === 'dark' ? <FontAwesomeIcon icon={faSun} size='lg' /> : <FontAwesomeIcon icon={faMoon} size='lg' />" :
              "theme === 'dark' ? <SunIcon className='w-6 h-6' /> : <MoonIcon className='w-6 h-6' />"
            }
          </button>
          ` : ''}
        </div>
      </header>
      <div className="flex">
        ${additionalFeatures.includes('sidebar') ? '<Sidebar />' : ''}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};`;
  await writeFile('./src/components/Layout.jsx', layoutContent);

  if (additionalFeatures.includes('sidebar')) {
    const sidebarContent = `import React from 'react';
${iconSet === 'lucide-react' ? "import { Home, Settings, User } from 'lucide-react';" : ''}
${iconSet === '@fortawesome/fontawesome-svg-core' ? "import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';\nimport { faHome, faCog, faUser } from '@fortawesome/free-solid-svg-icons';" : ''}
${iconSet === '@heroicons/react' ? "import { HomeIcon, CogIcon, UserIcon } from '@heroicons/react/24/solid';" : ''}

const Sidebar = () => {
  return (
    <aside className="bg-secondary text-secondary-foreground w-64 min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/10">
              ${iconSet === 'lucide-react' ? '<Home className="w-6 h-6" />' : 
                iconSet === '@fortawesome/fontawesome-svg-core' ? '<FontAwesomeIcon icon={faHome} size="lg" />' :
                '<HomeIcon className="w-6 h-6" />'}
              <span>Home</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/10">
              ${iconSet === 'lucide-react' ? '<Settings className="w-6 h-6" />' : 
                iconSet === '@fortawesome/fontawesome-svg-core' ? '<FontAwesomeIcon icon={faCog} size="lg" />' :
                '<CogIcon className="w-6 h-6" />'}
              <span>Settings</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/10">
              ${iconSet === 'lucide-react' ? '<User className="w-6 h-6" />' : 
                iconSet === '@fortawesome/fontawesome-svg-core' ? '<FontAwesomeIcon icon={faUser} size="lg" />' :
                '<UserIcon className="w-6 h-6" />'}
              <span>Profile</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;`;
    await writeFile('./src/components/Sidebar.jsx', sidebarContent);
  }

  if (additionalFeatures.includes('darkMode')) {
    const themeProviderContent = `import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);`;
    await writeFile('./src/components/ThemeProvider.jsx', themeProviderContent);
  }

  if (additionalFeatures.includes('form')) {
    const formContent = `import React from 'react';
import { useForm } from 'react-hook-form';

const SampleForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="w-full p-2 border rounded-md"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          className="w-full p-2 border rounded-md"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
        <textarea
          id="message"
          {...register('message', { required: 'Message is required' })}
          className="w-full p-2 border rounded-md"
          rows="4"
        ></textarea>
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
      </div>
      <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
        Submit
      </button>
    </form>
  );
};

export default SampleForm;`;
    await writeFile('./src/components/SampleForm.jsx', formContent);
  }
}

async function updateMainApp(additionalFeatures, iconSet) {
  const mainAppContent = `import React from 'react';
import { Layout } from './components/Layout';
${additionalFeatures.includes('darkMode') ? "import { ThemeProvider } from './components/ThemeProvider';" : ''}
${additionalFeatures.includes('form') ? "import SampleForm from './components/SampleForm';" : ''}
${additionalFeatures.includes('animations') ? "import { motion } from 'framer-motion';" : ''}

function App() {
  return (
    ${additionalFeatures.includes('darkMode') ? '<ThemeProvider>' : ''}
      <Layout>
        ${additionalFeatures.includes('animations') ? 
          `<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >` : ''}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Welcome to Rewrap</h1>
            <p className="mb-4">
              This app was created using{' '}
              <a 
                href="https://github.com/heycalebszn/Rewrap-" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline"
              >
                Rewrap
              </a>
            </p>
            ${additionalFeatures.includes('form') ? '<SampleForm />' : ''}
          </div>
        ${additionalFeatures.includes('animations') ? '</motion.div>' : ''}
      </Layout>
    ${additionalFeatures.includes('darkMode') ? '</ThemeProvider>' : ''}
  );
}

export default App;`;
  await writeFile('./src/App.jsx', mainAppContent);
}

