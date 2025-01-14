import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";


/**
 * Executes a shell command using `execa` and displays progress using a spinner.
 * 
 * @async
 * @function runCommand
 * @param {string} command - The command to run (e.g., "npm").
 * @param {string[]} args - The arguments for the command.
 * @param {Object} [options={}] - Additional options to pass to `execa` (e.g., `cwd`, `env`).
 * @returns {Promise<Object>} Resolves with an object containing `stdout` and `stderr` of the command.
 * 
 * @property {string} return.stdout - The standard output of the command.
 * @property {string} return.stderr - The standard error of the command.
 * 
 * @throws {Error} If the command fails, logs the error details and rethrows the error.
 */

export async function runCommand(command, args, options = {}) {
  const spinner = ora(`Running: ${command} ${args.join(" ")}`).start();
  try {
    const { stdout, stderr } = await execa(command, args, {
      ...options,
      stdio: "pipe",
    });
    spinner.succeed();
    return { stdout, stderr };
  } catch (error) {
    spinner.fail();
    console.error(chalk.red(`Error running ${command}:`));
    console.error(chalk.red(error.message));
    if (error.stdout) console.error(chalk.yellow("stdout:", error.stdout));
    if (error.stderr) console.error(chalk.yellow("stderr:", error.stderr));
    throw error;
  }
}
