import { Command, CommandContext, ExecResult } from '../../types.js';

export const mkdirCommand: Command = {
  name: 'mkdir',

  async execute(args: string[], ctx: CommandContext): Promise<ExecResult> {
    let recursive = false;
    const dirs: string[] = [];

    // Parse arguments
    for (const arg of args) {
      if (arg === '-p' || arg === '--parents') {
        recursive = true;
      } else if (arg.startsWith('-')) {
        // Ignore other flags
      } else {
        dirs.push(arg);
      }
    }

    if (dirs.length === 0) {
      return {
        stdout: '',
        stderr: 'mkdir: missing operand\n',
        exitCode: 1,
      };
    }

    let stderr = '';
    let exitCode = 0;

    for (const dir of dirs) {
      try {
        const fullPath = ctx.fs.resolvePath(ctx.cwd, dir);
        await ctx.fs.mkdir(fullPath, { recursive });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        stderr += `mkdir: cannot create directory '${dir}': ${message}\n`;
        exitCode = 1;
      }
    }

    return { stdout: '', stderr, exitCode };
  },
};
