import { Command, CommandContext, ExecResult } from '../../types.js';

export const echoCommand: Command = {
  name: 'echo',

  async execute(args: string[], _ctx: CommandContext): Promise<ExecResult> {
    let noNewline = false;
    let interpretEscapes = false;
    let startIndex = 0;

    // Parse flags
    while (startIndex < args.length) {
      const arg = args[startIndex];
      if (arg === '-n') {
        noNewline = true;
        startIndex++;
      } else if (arg === '-e') {
        interpretEscapes = true;
        startIndex++;
      } else if (arg === '-E') {
        interpretEscapes = false;
        startIndex++;
      } else if (arg === '-ne' || arg === '-en') {
        noNewline = true;
        interpretEscapes = true;
        startIndex++;
      } else {
        break;
      }
    }

    let output = args.slice(startIndex).join(' ');

    if (interpretEscapes) {
      output = output
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r')
        .replace(/\\a/g, '\x07')
        .replace(/\\b/g, '\b')
        .replace(/\\f/g, '\f')
        .replace(/\\v/g, '\v')
        .replace(/\\\\/g, '\\');
    }

    if (!noNewline) {
      output += '\n';
    }

    return {
      stdout: output,
      stderr: '',
      exitCode: 0,
    };
  },
};
