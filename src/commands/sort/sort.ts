import type { Command, CommandContext, ExecResult } from "../../types.js";
import { hasHelpFlag, showHelp, unknownOption } from "../help.js";

const sortHelp = {
  name: "sort",
  summary: "sort lines of text files",
  usage: "sort [OPTION]... [FILE]...",
  options: [
    "-f, --ignore-case    fold lower case to upper case characters",
    "-n, --numeric-sort   compare according to string numerical value",
    "-r, --reverse        reverse the result of comparisons",
    "-u, --unique         output only unique lines",
    "-k, --key=POS        sort via a key at field POS",
    "-t, --field-separator=SEP  use SEP as field separator",
    "    --help           display this help and exit",
  ],
};

export const sortCommand: Command = {
  name: "sort",
  async execute(args: string[], ctx: CommandContext): Promise<ExecResult> {
    if (hasHelpFlag(args)) {
      return showHelp(sortHelp);
    }

    let reverse = false;
    let numeric = false;
    let unique = false;
    let ignoreCase = false;
    let keyField: number | null = null;
    let fieldDelimiter: string | null = null;
    const files: string[] = [];

    // Parse arguments
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg === "-r" || arg === "--reverse") {
        reverse = true;
      } else if (arg === "-n" || arg === "--numeric-sort") {
        numeric = true;
      } else if (arg === "-u" || arg === "--unique") {
        unique = true;
      } else if (arg === "-f" || arg === "--ignore-case") {
        ignoreCase = true;
      } else if (arg === "-t" || arg === "--field-separator") {
        fieldDelimiter = args[++i] || null;
      } else if (arg.startsWith("-t")) {
        fieldDelimiter = arg.slice(2) || null;
      } else if (arg === "-k" || arg === "--key") {
        const keyArg = args[++i];
        if (keyArg) {
          const keyNum = parseInt(keyArg, 10);
          if (!Number.isNaN(keyNum) && keyNum >= 1) {
            keyField = keyNum;
          }
        }
      } else if (arg.startsWith("-k")) {
        const keyNum = parseInt(arg.slice(2), 10);
        if (!Number.isNaN(keyNum) && keyNum >= 1) {
          keyField = keyNum;
        }
      } else if (arg.startsWith("--")) {
        return unknownOption("sort", arg);
      } else if (arg.startsWith("-") && !arg.startsWith("--")) {
        // Handle combined flags like -rn
        for (const char of arg.slice(1)) {
          if (char === "r") reverse = true;
          else if (char === "n") numeric = true;
          else if (char === "u") unique = true;
          else if (char === "f") ignoreCase = true;
          else return unknownOption("sort", `-${char}`);
        }
      } else {
        files.push(arg);
      }
    }

    let content = "";

    // Read from files or stdin
    if (files.length === 0) {
      content = ctx.stdin;
    } else {
      for (const file of files) {
        const filePath = ctx.fs.resolvePath(ctx.cwd, file);
        try {
          content += await ctx.fs.readFile(filePath);
        } catch {
          return {
            stdout: "",
            stderr: `sort: ${file}: No such file or directory\n`,
            exitCode: 1,
          };
        }
      }
    }

    // Split into lines (preserve empty lines at the end for sorting)
    let lines = content.split("\n");

    // Remove last empty element if content ends with newline
    if (lines.length > 0 && lines[lines.length - 1] === "") {
      lines.pop();
    }

    // Sort lines
    lines.sort((a, b) => {
      let valA = a;
      let valB = b;

      // Extract key field if specified
      if (keyField !== null) {
        const splitPattern = fieldDelimiter !== null ? fieldDelimiter : /\s+/;
        const partsA = a.split(splitPattern);
        const partsB = b.split(splitPattern);
        valA = partsA[keyField - 1] || "";
        valB = partsB[keyField - 1] || "";
      }

      // Apply case folding if -f is specified
      if (ignoreCase) {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (numeric) {
        const numA = parseFloat(valA) || 0;
        const numB = parseFloat(valB) || 0;
        return numA - numB;
      }

      return valA.localeCompare(valB);
    });

    if (reverse) {
      lines.reverse();
    }

    // Remove duplicates if -u
    if (unique) {
      if (ignoreCase) {
        // Case-insensitive uniqueness
        const seen = new Set<string>();
        lines = lines.filter((line) => {
          const key = line.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      } else {
        lines = [...new Set(lines)];
      }
    }

    const output = lines.length > 0 ? `${lines.join("\n")}\n` : "";
    return { stdout: output, stderr: "", exitCode: 0 };
  },
};
