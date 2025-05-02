# Rewrap Installer

Rewrap Installer is a powerful CLI tool that streamlines the process of setting up modern web development projects. It provides an interactive setup experience, allowing you to quickly configure a project with your preferred framework, language, and additional features.

## Features

- **Multiple Framework Support**: Choose between React, Vue, and Svelte.
- **Language Options**: Set up your project with JavaScript or TypeScript.
- **TailwindCSS Integration**: Automatically installs and configures TailwindCSS.
- **UI Component Libraries**: Option to include shadcn/ui components (for React projects).
- **Icon Sets**: Choose from Lucide, Font Awesome, or Heroicons.
- **Additional Features**:
  - Dark Mode
  - Responsive Sidebar
  - Sample Form
  - Animations
- **Popular Package Integration**: Easily add packages like React Router, Axios, Redux Toolkit, React Query, Framer Motion, and React Hook Form.

## Installation

Install your project using vite
```bash
npm create vite@latest 
```

You can use Rewrap Installer with npx without installing it globally:

```bash
npx rewrapped

```

Or, if you prefer, you can install it globally:

```shellscript
npm i -g rewrapped
```

Then run it using:

```shellscript
rewrapped
```

## Usage

1. First install react using vite then
2. Run the installer command.
3. Follow the interactive prompts to configure your project:

1. Choose between creating a new project or configuring an existing one.
2. Select your preferred framework (React, Vue, or Svelte).
3. Choose the language (JavaScript or TypeScript).
4. Opt for additional features and packages.



3. The installer will set up your project with the selected configuration.


## Project Structure

The installer creates a well-organized project structure:

- Configures TailwindCSS with a custom configuration.
- Sets up a global CSS file with design tokens for light and dark modes.
- Creates reusable components like Layout and Sidebar (if selected).
- Implements ThemeProvider for dark mode functionality (if selected).
- Adds a sample form component (if selected).


## Post-Installation

After the installation is complete, you can start your development server:

```shellscript
cd your-project-name
npm run dev
```

## Contributing

Contributions to Rewrap Installer are welcome! Please refer to the project's GitHub repository for contribution guidelines.

## License

[MIT License](LICENSE)

---

Happy coding with Rewrap Installer! 🚀

![npm](https://img.shields.io/npm/dm/<rewrap-vitejs-tailwind>)