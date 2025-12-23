import { Command, CommandContext, ExecResult } from '../../types.js';

export const wcCommand: Command = {
  name: 'wc',

  async execute(args: string[], ctx: CommandContext): Promise<ExecResult> {
    let showLines = false;
    let showWords = false;
    let showChars = false;
    const files: string[] = [];

    // Parse arguments
    for (const arg of args) {
      if (arg.startsWith('-') && !arg.startsWith('--')) {
        for (const flag of arg.slice(1)) {
          if (flag === 'l') showLines = true;
          else if (flag === 'w') showWords = true;
          else if (flag === 'c' || flag === 'm') showChars = true;
        }
      } else if (arg === '--lines') {
        showLines = true;
      } else if (arg === '--words') {
        showWords = true;
      } else if (arg === '--bytes' || arg === '--chars') {
        showChars = true;
      } else {
        files.push(arg);
      }
    }

    // If no flags specified, show all
    if (!showLines && !showWords && !showChars) {
      showLines = showWords = showChars = true;
    }

    // If no files, read from stdin
    if (files.length === 0) {
      const stats = countStats(ctx.stdin);
      return {
        stdout: formatStats(stats, showLines, showWords, showChars, '') + '\n',
        stderr: '',
        exitCode: 0,
      };
    }

    let stdout = '';
    let stderr = '';
    let exitCode = 0;
    let totalLines = 0;
    let totalWords = 0;
    let totalChars = 0;

    for (const file of files) {
      try {
        const filePath = ctx.fs.resolvePath(ctx.cwd, file);
        const content = await ctx.fs.readFile(filePath);
        const stats = countStats(content);

        totalLines += stats.lines;
        totalWords += stats.words;
        totalChars += stats.chars;

        stdout += formatStats(stats, showLines, showWords, showChars, file) + '\n';
      } catch {
        stderr += `wc: ${file}: No such file or directory\n`;
        exitCode = 1;
      }
    }

    // Show total for multiple files
    if (files.length > 1) {
      stdout += formatStats(
        { lines: totalLines, words: totalWords, chars: totalChars },
        showLines,
        showWords,
        showChars,
        'total'
      ) + '\n';
    }

    return { stdout, stderr, exitCode };
  },
};

function countStats(content: string): { lines: number; words: number; chars: number } {
  const lines = content.split('\n').length - (content.endsWith('\n') ? 1 : 0);
  const words = content.split(/\s+/).filter(w => w.length > 0).length;
  const chars = content.length;

  return { lines, words, chars };
}

function formatStats(
  stats: { lines: number; words: number; chars: number },
  showLines: boolean,
  showWords: boolean,
  showChars: boolean,
  filename: string
): string {
  const parts: string[] = [];

  if (showLines) parts.push(String(stats.lines).padStart(7));
  if (showWords) parts.push(String(stats.words).padStart(7));
  if (showChars) parts.push(String(stats.chars).padStart(7));

  if (filename) {
    parts.push(filename);
  }

  return parts.join(' ');
}
