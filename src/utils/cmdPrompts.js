import prompts from "prompts";

/**
 * Handles command-line prompts for project configuration using the `prompts` library.
 * 
 * @async
 * @function cmdPrompts
 * @returns {Promise<Object>} An object containing the user's responses, project name, 
 *                             creation preference, and project type.
 * 
 * @property {Object} return.response - User responses to all prompts.
 * @property {string} [return.projectName] - The name of the project (if creating a new project).
 * @property {boolean} return.shouldCreateProject - Indicates if a new project is being created.
 * @property {Object} return.projectTypeResponse - User's selection for project type (new or existing).
 */

export default async function cmdPrompts() {
  let projectName;
  let shouldCreateProject = true;

  const projectTypeResponse = await prompts({
    type: "select",
    name: "projectType",
    message: "Is this a new project or an existing project?",
    choices: [
      { title: "New Project", value: "new" },
      { title: "Existing Project", value: "existing" },
    ],
    initial: 0,
  });

  const response = await prompts([
    ...(shouldCreateProject
      ? [
          {
            type: "text",
            name: "projectName",
            message: "What is your project name?",
            initial: "rewrap-app",
          },
        ]
      : []),
    {
      type: "select",
      name: "framework",
      message: "Which framework would you like to use?",
      choices: [
        { title: "React", value: "react" },
        { title: "Vue", value: "vue" },
        { title: "Svelte", value: "svelte" },
      ],
      initial: 0,
    },
    {
      type: "select",
      name: "language",
      message: "Which language would you like to use?",
      choices: [
        { title: "JavaScript", value: "javascript" },
        { title: "TypeScript", value: "typescript" },
      ],
      initial: 1,
    },
    {
      type: "confirm",
      name: "useShadcn",
      message: "Would you like to include shadcn/ui components? (React only)",
      initial: true,
    },
    {
      type: "select",
      name: "iconSet",
      message: "Which icon set would you like to use?",
      choices: [
        { title: "Lucide", value: "lucide-react" },
        { title: "Font Awesome", value: "@fortawesome/fontawesome-svg-core" },
        { title: "Heroicons", value: "@heroicons/react" },
      ],
      initial: 0,
    },
    {
      type: "multiselect",
      name: "additionalFeatures",
      message: "Select additional features to include:",
      choices: [
        { title: "Dark Mode", value: "darkMode" },
        { title: "Responsive Sidebar", value: "sidebar" },
        { title: "Sample Form", value: "form" },
        { title: "Animations", value: "animations" },
      ],
    },
    {
      type: "multiselect",
      name: "additionalPackages",
      message: "Select additional packages to install:",
      choices: [
        { title: "React Router", value: "react-router-dom" },
        { title: "Axios", value: "axios" },
        { title: "Redux Toolkit", value: "@reduxjs/toolkit" },
        { title: "React Query", value: "react-query" },
        { title: "Motion (prev Framer Motion)", value: "motion" },
        { title: "React Hook Form", value: "react-hook-form" },
      ],
    },
    {
      type: "confirm",
      name: "install",
      message: "Do you want to proceed with the installation?",
      initial: true,
    },
  ]);
  return {
    response,
    projectName,
    shouldCreateProject,
    projectTypeResponse
  };
}
