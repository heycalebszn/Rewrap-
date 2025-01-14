import fs from "fs/promises";
import chalk from "chalk";
import path from "path";

/**
 * Writes content to a specified file, creating directories as needed.
 * 
 * @async
 * @function writeFile
 * @param {string} filePath - The path to the file to be written.
 * @param {string} content - The content to write to the file.
 * 
 * @throws {Error} Logs an error message and rethrows the error if the file write fails.
 */
export async function writeFile(filePath, content) {
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content, 'utf8');
    } catch (error) {
      console.error(chalk.red(`Error writing to ${filePath}:`), error);
      throw error;
    }
  }