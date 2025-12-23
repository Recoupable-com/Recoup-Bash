# Bash Commands to Support

This document outlines the bash commands and features that BashEnv should support.

## File System Commands

### ls - List directory contents
```bash
ls                    # List current directory
ls -l                 # Long format with details
ls -a                 # Show hidden files (starting with .)
ls -la                # Combined long format + hidden
ls /path/to/dir       # List specific directory
ls -R                 # Recursive listing
ls *.txt              # Glob pattern matching
```

### cat - Concatenate and display files
```bash
cat file.txt              # Display file contents
cat file1.txt file2.txt   # Concatenate multiple files
cat -n file.txt           # Show line numbers
```

### head / tail - Display beginning/end of files
```bash
head file.txt         # First 10 lines
head -n 5 file.txt    # First 5 lines
tail file.txt         # Last 10 lines
tail -n 5 file.txt    # Last 5 lines
```

### mkdir - Create directories
```bash
mkdir dir             # Create directory
mkdir -p a/b/c        # Create nested directories
```

### rm - Remove files/directories
```bash
rm file.txt           # Remove file
rm -r dir             # Remove directory recursively
rm -f file.txt        # Force remove (no error if missing)
rm -rf dir            # Force remove directory recursively
```

### cp - Copy files/directories
```bash
cp src.txt dst.txt        # Copy file
cp -r srcdir dstdir       # Copy directory recursively
```

### mv - Move/rename files
```bash
mv old.txt new.txt        # Rename file
mv file.txt /other/dir/   # Move file to directory
```

### touch - Create empty file or update timestamp
```bash
touch file.txt            # Create empty file
```

### pwd - Print working directory
```bash
pwd                       # Show current directory
```

### cd - Change directory
```bash
cd /path/to/dir           # Change to directory
cd ..                     # Go up one level
cd ~                      # Go to home directory
cd -                      # Go to previous directory
```

## Text Processing Commands

### grep - Search for patterns
```bash
grep "pattern" file.txt           # Search for pattern
grep -i "pattern" file.txt        # Case insensitive
grep -r "pattern" dir/            # Recursive search
grep -n "pattern" file.txt        # Show line numbers
grep -v "pattern" file.txt        # Invert match (exclude)
grep -c "pattern" file.txt        # Count matches
grep -l "pattern" *.txt           # List files with matches
grep -E "regex" file.txt          # Extended regex
grep -w "word" file.txt           # Match whole words only
```

### sed - Stream editor
```bash
sed 's/old/new/' file.txt         # Replace first occurrence per line
sed 's/old/new/g' file.txt        # Replace all occurrences
sed -n '5p' file.txt              # Print line 5
sed -n '5,10p' file.txt           # Print lines 5-10
sed '/pattern/d' file.txt         # Delete matching lines
```

### awk - Pattern scanning
```bash
awk '{print $1}' file.txt         # Print first column
awk -F: '{print $1}' file.txt     # Use : as delimiter
awk 'NR==5' file.txt              # Print line 5
awk '{print NF}' file.txt         # Print number of fields
```

### sort - Sort lines
```bash
sort file.txt                     # Sort alphabetically
sort -n file.txt                  # Sort numerically
sort -r file.txt                  # Reverse sort
sort -u file.txt                  # Sort and remove duplicates
sort -k2 file.txt                 # Sort by 2nd column
```

### uniq - Report or omit repeated lines
```bash
uniq file.txt                     # Remove adjacent duplicates
uniq -c file.txt                  # Count occurrences
uniq -d file.txt                  # Only show duplicates
```

### wc - Word, line, character count
```bash
wc file.txt                       # Lines, words, chars
wc -l file.txt                    # Line count only
wc -w file.txt                    # Word count only
wc -c file.txt                    # Character count only
```

### cut - Remove sections from lines
```bash
cut -d: -f1 file.txt              # Cut first field (: delimiter)
cut -c1-10 file.txt               # Cut characters 1-10
```

### tr - Translate characters
```bash
tr 'a-z' 'A-Z'                    # Convert to uppercase
tr -d '\n'                        # Delete newlines
tr -s ' '                         # Squeeze repeated spaces
```

## Output Commands

### echo - Display text
```bash
echo "Hello World"                # Print text
echo -n "No newline"              # Print without newline
echo -e "Tab:\tNewline:\n"        # Interpret escape sequences
echo $VAR                         # Print variable
```

### printf - Formatted output
```bash
printf "%s\n" "text"              # Print with format
printf "%d\n" 42                  # Print integer
printf "%-10s %s\n" "a" "b"       # Formatted columns
```

## Pipes and Redirection

### Pipes
```bash
cat file.txt | grep "pattern"                 # Pipe output
ls -la | grep "txt" | wc -l                   # Chain multiple
cat file.txt | head -5 | tail -1              # Get line 5
```

### Output Redirection
```bash
echo "text" > file.txt            # Write to file (overwrite)
echo "text" >> file.txt           # Append to file
command 2> error.txt              # Redirect stderr
command > out.txt 2>&1            # Redirect both stdout and stderr
command > /dev/null               # Discard output
```

### Input Redirection
```bash
grep "pattern" < file.txt         # Read from file
```

## Variables and Environment

### Environment Variables
```bash
export VAR=value                  # Set variable
echo $VAR                         # Use variable
echo ${VAR}                       # Use variable (explicit)
echo ${VAR:-default}              # Default if unset
unset VAR                         # Remove variable
env                               # List all variables
```

### Command Substitution
```bash
echo $(pwd)                       # Command substitution
files=$(ls)                       # Store output in variable
```

## Control Flow

### Conditionals
```bash
test -f file.txt                  # Test if file exists
[ -f file.txt ]                   # Same as test
[ -d dir ]                        # Test if directory exists
[ -z "$VAR" ]                     # Test if variable is empty
[ "$a" = "$b" ]                   # String equality
```

### Logical Operators
```bash
command1 && command2              # Run command2 if command1 succeeds
command1 || command2              # Run command2 if command1 fails
command1 ; command2               # Run both regardless
```

## Utility Commands

### find - Search for files
```bash
find . -name "*.txt"              # Find by name
find . -type f                    # Find files only
find . -type d                    # Find directories only
find . -name "*.txt" -exec cat {} \;  # Execute command on results
```

### xargs - Build command lines
```bash
find . -name "*.txt" | xargs cat  # Pass results to cat
echo "a b c" | xargs -n1          # One arg per line
```

### tee - Read from stdin and write to stdout and files
```bash
echo "text" | tee file.txt        # Write to stdout and file
echo "text" | tee -a file.txt     # Append mode
```

### basename / dirname - Strip path components
```bash
basename /path/to/file.txt        # Returns: file.txt
dirname /path/to/file.txt         # Returns: /path/to
```

### realpath - Resolve path
```bash
realpath ./relative/path          # Get absolute path
```

## Exit Codes

```bash
command; echo $?                  # Show exit code of previous command
exit 0                            # Exit with success
exit 1                            # Exit with error
```

## Glob Patterns

```bash
ls *.txt                          # All .txt files
ls file?.txt                      # Single character wildcard
ls [abc].txt                      # Character class
ls [a-z].txt                      # Character range
ls **/*.txt                       # Recursive glob (if supported)
```

## Priority of Implementation

### Phase 1 - Core (MVP)
1. `ls`, `cat`, `echo`, `pwd`
2. `mkdir`, `touch`, `rm`
3. Basic pipes (`|`)
4. Output redirection (`>`, `>>`)
5. Environment variables (`$VAR`)
6. `cd` (working directory management)

### Phase 2 - Essential Text Processing
1. `grep` (basic options)
2. `head`, `tail`
3. `wc`
4. `sort`, `uniq`

### Phase 3 - Extended Features
1. `cp`, `mv`
2. `find`
3. `sed` (basic substitution)
4. `cut`, `tr`
5. Command chaining (`&&`, `||`, `;`)

### Phase 4 - Advanced
1. `awk` (basic)
2. Glob patterns
3. `test` / `[ ]` conditionals
4. Command substitution `$()`
