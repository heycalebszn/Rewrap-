import { writeFile } from "../src/utils/writeToFile.js";

export async function createComponents(additionalFeatures, iconSet) {
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
  
export async function updateMainApp(additionalFeatures, iconSet) {
    const mainAppContent = `import React from 'react';
  import { Layout } from './components/Layout';
  ${additionalFeatures.includes('darkMode') ? "import { ThemeProvider } from './components/ThemeProvider';" : ''}
  ${additionalFeatures.includes('form') ? "import SampleForm from './components/SampleForm';" : ''}
  ${additionalFeatures.includes('animations') ? "import { motion } from 'motion';" : ''}
  
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
  
  