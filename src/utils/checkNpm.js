import chalk from "chalk";
import { execa } from "execa";

/**
 * Checks if npm is installed and accessible on the system.
 * 
 * @async
 * @function checkNpmInstalled
 * @returns {Promise<boolean>} Resolves to `true` if npm is installed, otherwise `false`.
 * 
 * @throws Logs an error message to the console if npm is not installed or accessible.
 */

export async function checkNpmInstalled() {
    try {
      await execa('npm', ['--version']);
      return true;
    } catch (error) {
      console.error(chalk.red('npm is not installed or not accessible. Please install npm and try again.'));
      return false;
    }
  }