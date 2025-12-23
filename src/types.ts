import { VirtualFs } from './fs.js';

export interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface CommandContext {
  fs: VirtualFs;
  cwd: string;
  env: Record<string, string>;
  stdin: string;
}

export interface Command {
  name: string;
  execute(args: string[], ctx: CommandContext): Promise<ExecResult>;
}

export type CommandRegistry = Map<string, Command>;
