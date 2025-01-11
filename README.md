# Rewrap Installer

A CLI tool to set up a new or existing project with a selected framework, language, and features, tailored to your needs. This installer makes it easy to bootstrap your project while allowing you to select additional features and packages.

---

## Features

- Supports React, Vue, and Svelte frameworks
- Choose between JavaScript and TypeScript
- Option to include **shadcn/ui** components (React only)
- Pre-configured TailwindCSS setup
- Dark mode support
- Add responsive layouts and pre-built components like forms and sidebars
- Include popular icon sets like Lucide, Font Awesome, or Heroicons
- Select and install additional packages like:
  - React Router
  - Axios
  - Redux Toolkit
  - React Query
  - Framer Motion
  - React Hook Form

---

## Installation

### Prerequisites
Make sure you have the following installed:
- Node.js (v14 or later)
- npm (v6 or later)

### Usage

1. Clone the repository or download the installer script:
   ```bash
   git clone https://github.com/your-repo/rewrap-installer.git
   cd rewrap-installer

	2.	Install dependencies:

npm install


	3.	Run the installer:

./rewrap-installer

How It Works
	1.	The installer prompts you to:
	•	Choose between a New Project or an Existing Project.
	•	Specify your project name (for new projects).
	•	Select a framework, language, and optional features.
	•	Decide on additional packages to install.
	2.	For new projects:
	•	It creates a Vite-based project and installs TailwindCSS.
	•	Adds configurations for the selected features.
	3.	For existing projects:
	•	Installs the selected features, additional packages, and components.

Available Commands
	•	Start Development Server:

npm run dev


	•	Build for Production:

npm run build


	•	Lint Code:

npm run lint

Project Configuration
	•	TailwindCSS:
The tailwind.config.js and src/index.css files are automatically configured based on your choices.
	•	Custom Components:
	•	Pre-built components (e.g., Sidebar, Dark Mode toggle) are added if selected.
	•	Easily extendable and customizable.

Contribution

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

