import { Command, CommandContext, ExecResult } from '../../types.js';
import { minimatch } from 'minimatch';

export const lsCommand: Command = {
  name: 'ls',

  async execute(args: string[], ctx: CommandContext): Promise<ExecResult> {
    let showAll = false;
    let longFormat = false;
    let recursive = false;
    const paths: string[] = [];

    // Parse arguments
    for (const arg of args) {
      if (arg.startsWith('-') && !arg.startsWith('--')) {
        for (const flag of arg.slice(1)) {
          if (flag === 'a') showAll = true;
          else if (flag === 'l') longFormat = true;
          else if (flag === 'R') recursive = true;
        }
      } else if (arg === '--all') {
        showAll = true;
      } else {
        paths.push(arg);
      }
    }

    if (paths.length === 0) {
      paths.push('.');
    }

    let stdout = '';
    let stderr = '';
    let exitCode = 0;

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      // Add blank line between directory listings
      if (i > 0 && stdout && !stdout.endsWith('\n\n')) {
        stdout += '\n';
      }

      // Check if it's a glob pattern
      if (path.includes('*') || path.includes('?') || path.includes('[')) {
        const result = await listGlob(path, ctx, showAll, longFormat);
        stdout += result.stdout;
        stderr += result.stderr;
        if (result.exitCode !== 0) exitCode = result.exitCode;
      } else {
        const result = await listPath(path, ctx, showAll, longFormat, recursive, paths.length > 1);
        stdout += result.stdout;
        stderr += result.stderr;
        if (result.exitCode !== 0) exitCode = result.exitCode;
      }
    }

    return { stdout, stderr, exitCode };
  },
};

async function listGlob(
  pattern: string,
  ctx: CommandContext,
  showAll: boolean,
  longFormat: boolean
): Promise<ExecResult> {
  const allPaths = ctx.fs.getAllPaths();
  const basePath = ctx.fs.resolvePath(ctx.cwd, '.');

  const matches: string[] = [];
  for (const p of allPaths) {
    const relativePath = p.startsWith(basePath)
      ? p.slice(basePath.length + 1) || p
      : p;

    if (minimatch(relativePath, pattern) || minimatch(p, pattern)) {
      matches.push(relativePath || p);
    }
  }

  if (matches.length === 0) {
    return {
      stdout: '',
      stderr: `ls: cannot access '${pattern}': No such file or directory\n`,
      exitCode: 2,
    };
  }

  matches.sort();

  if (longFormat) {
    const lines: string[] = [];
    for (const match of matches) {
      const fullPath = ctx.fs.resolvePath(ctx.cwd, match);
      try {
        const stat = await ctx.fs.stat(fullPath);
        const mode = stat.isDirectory ? 'drwxr-xr-x' : '-rw-r--r--';
        const type = stat.isDirectory ? '/' : '';
        lines.push(`${mode} 1 user user    0 Jan  1 00:00 ${match}${type}`);
      } catch {
        lines.push(`-rw-r--r-- 1 user user    0 Jan  1 00:00 ${match}`);
      }
    }
    return { stdout: lines.join('\n') + '\n', stderr: '', exitCode: 0 };
  }

  return { stdout: matches.join('\n') + '\n', stderr: '', exitCode: 0 };
}

async function listPath(
  path: string,
  ctx: CommandContext,
  showAll: boolean,
  longFormat: boolean,
  recursive: boolean,
  showHeader: boolean
): Promise<ExecResult> {
  const fullPath = ctx.fs.resolvePath(ctx.cwd, path);

  try {
    const stat = await ctx.fs.stat(fullPath);

    if (!stat.isDirectory) {
      // It's a file, just show it
      if (longFormat) {
        return {
          stdout: `-rw-r--r-- 1 user user    0 Jan  1 00:00 ${path}\n`,
          stderr: '',
          exitCode: 0,
        };
      }
      return { stdout: path + '\n', stderr: '', exitCode: 0 };
    }

    // It's a directory
    let entries = await ctx.fs.readdir(fullPath);

    // Filter hidden files unless -a
    if (!showAll) {
      entries = entries.filter(e => !e.startsWith('.'));
    }

    let stdout = '';

    if (showHeader || recursive) {
      stdout += `${path}:\n`;
    }

    if (longFormat) {
      stdout += `total ${entries.length}\n`;
      for (const entry of entries) {
        const entryPath = fullPath === '/' ? '/' + entry : fullPath + '/' + entry;
        try {
          const entryStat = await ctx.fs.stat(entryPath);
          const mode = entryStat.isDirectory ? 'drwxr-xr-x' : '-rw-r--r--';
          const suffix = entryStat.isDirectory ? '/' : '';
          stdout += `${mode} 1 user user    0 Jan  1 00:00 ${entry}${suffix}\n`;
        } catch {
          stdout += `-rw-r--r-- 1 user user    0 Jan  1 00:00 ${entry}\n`;
        }
      }
    } else {
      stdout += entries.join('\n') + (entries.length ? '\n' : '');
    }

    // Handle recursive
    if (recursive) {
      for (const entry of entries) {
        const entryPath = fullPath === '/' ? '/' + entry : fullPath + '/' + entry;
        try {
          const entryStat = await ctx.fs.stat(entryPath);
          if (entryStat.isDirectory) {
            stdout += '\n';
            const subPath = path === '.' ? entry : `${path}/${entry}`;
            const result = await listPath(subPath, ctx, showAll, longFormat, recursive, true);
            stdout += result.stdout;
          }
        } catch {
          // Skip
        }
      }
    }

    return { stdout, stderr: '', exitCode: 0 };
  } catch {
    return {
      stdout: '',
      stderr: `ls: cannot access '${path}': No such file or directory\n`,
      exitCode: 2,
    };
  }
}
