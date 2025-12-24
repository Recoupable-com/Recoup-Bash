# BashEnv - Unsupported Features

This document lists features **not yet implemented** in BashEnv. Use this as a reference for future development priorities.

---

## Shell Language Features (Not Implemented)

### Secondary Missing Features

| Feature | Syntax | Why It Matters |
|---------|--------|----------------|
| Bash arrays | `arr=(a b c)`, `${arr[@]}` | Indexed and associative arrays in bash |
| Brace expansion | `{a,b,c}`, `{1..10}` | Generate sequences and combinations |
| Process substitution | `<(cmd)`, `>(cmd)` | Treat command output as a file |
| `select` loops | `select x in a b c` | Interactive menu selection |
| `declare`/`readonly` | `declare -i`, `readonly` | Variable attributes and constants |

---

## Command Options (Not Implemented)

### Text Processing

**sed** - Missing:
- Branching (`b`, `t`, `:label`) - Complex conditional scripts
- `-f file` - Read script from file

**awk** - Missing:
- User-defined functions (`function name() {}`)
- I/O redirection within awk (`print > "file"`, `getline < "file"`)

### File Operations

**touch** - Major limitation:
- Does not update timestamps on existing files (only creates new files)
- Missing: `-a`, `-m`, `-d`, `-t`, `-r` options

**tail** - Missing:
- `-f` follow mode (log monitoring)
- `-r` reverse display

**find** - Missing:
- `-user`, `-group` - Owner matching
- `-atime`, `-ctime` - Access/change time filtering
- `-prune` - Skip directories

### Other Commands

**tree** - Missing:
- File metadata (`-s`, `-p`, `-D`)
- Filtering (`-I`, `-P` patterns)
- Sorting options (`-t`, `-r`)

---

## Common Missing Features Across Commands

- Interactive prompts (`-i`)
- Backup functionality (`-b`, `--backup`)
- Color output (`--color`)
- Real ownership (user/group hardcoded)

---

## Implementation Priority

### Phase 2: Nice to Have

| # | Feature | Command | Why It Matters |
|---|---------|---------|----------------|
| 1 | `-f` follow mode | `tail` | Log monitoring |
| 2 | Branching | `sed` | Complex conditional scripts |
| 3 | User-defined functions | `awk` | Reusable logic |
| 4 | Brace expansion | shell | `{a,b,c}`, `{1..10}` |
| 5 | Bash arrays | shell | Indexed arrays |

---

## Already Implemented ✅

### Shell Features
- `if`/`elif`/`else`/`fi` statements
- `for` loops (including `for x in list`)
- `while` and `until` loops
- User-defined functions (`function name {}` and `name() {}`)
- `local` variables in functions
- Variable expansion (`$VAR`, `${VAR}`, `${VAR:-default}`)
- Pipes (`|`), redirections (`>`, `>>`, `2>`, `<`, `2>&1`)
- Command chaining (`&&`, `||`, `;`)
- Glob patterns (`*`, `?`, `[...]`)
- Negation operator (`!`)
- **Command substitution** `$(cmd)` - Capture command output
- **Arithmetic expansion** `$((expr))` - Math operations (+, -, *, /, %, **, comparisons, logical, bitwise)
- **`case...esac` statements** - Switch-case with pattern matching
- **`[[ ]]` test expressions** - String/numeric/file tests, pattern matching, regex `=~`
- **Here documents** `<<EOF` - Multi-line input to commands

### Commands (Well-Supported)
- **grep**: `-E`, `-F`, `-i`, `-v`, `-w`, `-c`, `-l`, `-L`, `-n`, `-h`, `-o`, `-q`, `-r`, `-R`, `-A`, `-B`, `-C`, `--include`, `--exclude`
- **sed**: `-n`, `-i`, `-e`, `-E`, `s///`, `d`, `p`, `a`, `i`, `c`, `h/H/g/G/x`, `n`, `N`, `q`, `y`, `=`
- **awk**: `-F`, `-v`, `BEGIN`/`END`, pattern ranges, `getline`, math functions, arrays, control structures
- **find**: `-name`, `-type`, `-size`, `-mtime`, `-perm`, `-exec`, `-delete`, `-print0`
- **ls**: `-a`, `-l`, `-h`, `-S`, `-r`, `-R`, `-t`
- **sort**: `-r`, `-n`, `-u`, `-k`, `-t`, `-f`, complex key syntax
- **tr**: `-d`, `-s`, `-c`, character classes
