import type { IFileSystem } from "../fs.js";
import type { ExecResult } from "../types.js";

/**
 * Context passed to interpreter modules for executing commands
 */
export interface InterpreterContext {
  /** Virtual filesystem */
  fs: IFileSystem;
  /** Current working directory */
  cwd: string;
  /** Environment variables */
  env: Record<string, string>;
  /** Execute a command string */
  exec: (cmd: string) => Promise<ExecResult>;
  /** Expand variables in a string (async, supports command substitution) */
  expandVariables: (str: string) => Promise<string>;
  /** Resolve a path relative to cwd */
  resolvePath: (path: string) => string;
  /** Maximum loop iterations allowed */
  maxLoopIterations: number;
}
