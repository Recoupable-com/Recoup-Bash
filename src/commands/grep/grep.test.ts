import { describe, it, expect } from 'vitest';
import { BashEnv } from '../../BashEnv.js';

describe('grep', () => {
  it('should find matching lines', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'hello world\nfoo bar\nhello again\n' },
    });
    const result = await env.exec('grep hello /test.txt');
    expect(result.stdout).toBe('hello world\nhello again\n');
    expect(result.stderr).toBe('');
    expect(result.exitCode).toBe(0);
  });

  it('should return exit code 1 when no match', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'hello world\n' },
    });
    const result = await env.exec('grep missing /test.txt');
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('');
    expect(result.exitCode).toBe(1);
  });

  it('should be case sensitive by default', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'Hello\nhello\nHELLO\n' },
    });
    const result = await env.exec('grep hello /test.txt');
    expect(result.stdout).toBe('hello\n');
    expect(result.stderr).toBe('');
  });

  it('should be case insensitive with -i', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'Hello\nhello\nHELLO\n' },
    });
    const result = await env.exec('grep -i hello /test.txt');
    expect(result.stdout).toBe('Hello\nhello\nHELLO\n');
    expect(result.stderr).toBe('');
  });

  it('should be case insensitive with --ignore-case', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'Hello\nhello\n' },
    });
    const result = await env.exec('grep --ignore-case hello /test.txt');
    expect(result.stdout).toBe('Hello\nhello\n');
    expect(result.stderr).toBe('');
  });

  it('should show line numbers with -n', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'aaa\nbbb\naaa\n' },
    });
    const result = await env.exec('grep -n aaa /test.txt');
    expect(result.stdout).toBe('1:aaa\n3:aaa\n');
    expect(result.stderr).toBe('');
  });

  it('should show line numbers with --line-number', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'match\nno\nmatch\n' },
    });
    const result = await env.exec('grep --line-number match /test.txt');
    expect(result.stdout).toBe('1:match\n3:match\n');
    expect(result.stderr).toBe('');
  });

  it('should invert match with -v', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'keep\nremove\nkeep\n' },
    });
    const result = await env.exec('grep -v remove /test.txt');
    expect(result.stdout).toBe('keep\nkeep\n');
    expect(result.stderr).toBe('');
  });

  it('should invert match with --invert-match', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'yes\nno\nyes\n' },
    });
    const result = await env.exec('grep --invert-match no /test.txt');
    expect(result.stdout).toBe('yes\nyes\n');
    expect(result.stderr).toBe('');
  });

  it('should count matches with -c', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'a\nb\na\na\n' },
    });
    const result = await env.exec('grep -c a /test.txt');
    expect(result.stdout).toBe('3\n');
    expect(result.stderr).toBe('');
  });

  it('should count matches with --count', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'x\nx\ny\n' },
    });
    const result = await env.exec('grep --count x /test.txt');
    expect(result.stdout).toBe('2\n');
    expect(result.stderr).toBe('');
  });

  it('should list files with matches using -l', async () => {
    const env = new BashEnv({
      files: {
        '/a.txt': 'found here\n',
        '/b.txt': 'nothing\n',
        '/c.txt': 'also found\n',
      },
    });
    const result = await env.exec('grep -l found /a.txt /b.txt /c.txt');
    expect(result.stdout).toBe('/a.txt\n/c.txt\n');
    expect(result.stderr).toBe('');
  });

  it('should list files with --files-with-matches', async () => {
    const env = new BashEnv({
      files: {
        '/a.txt': 'yes\n',
        '/b.txt': 'no\n',
      },
    });
    const result = await env.exec('grep --files-with-matches yes /a.txt /b.txt');
    expect(result.stdout).toBe('/a.txt\n');
    expect(result.stderr).toBe('');
  });

  it('should search recursively with -r', async () => {
    const env = new BashEnv({
      files: {
        '/dir/root.txt': 'needle here\n',
        '/dir/sub/file.txt': 'another needle\n',
      },
    });
    const result = await env.exec('grep -r needle /dir');
    expect(result.stdout).toBe('/dir/root.txt:needle here\n/dir/sub/file.txt:another needle\n');
    expect(result.stderr).toBe('');
  });

  it('should search recursively with -R', async () => {
    const env = new BashEnv({
      files: { '/dir/file.txt': 'findme\n' },
    });
    const result = await env.exec('grep -R findme /dir');
    expect(result.stdout).toBe('/dir/file.txt:findme\n');
    expect(result.stderr).toBe('');
  });

  it('should match whole words with -w', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'cat\ncats\ncat dog\ncaterpillar\n' },
    });
    const result = await env.exec('grep -w cat /test.txt');
    expect(result.stdout).toBe('cat\ncat dog\n');
    expect(result.stderr).toBe('');
  });

  it('should match whole words with --word-regexp', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'the\ntheme\nthe end\n' },
    });
    const result = await env.exec('grep --word-regexp the /test.txt');
    expect(result.stdout).toBe('the\nthe end\n');
    expect(result.stderr).toBe('');
  });

  it('should support extended regex with -E', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'cat\ndog\nbird\n' },
    });
    const result = await env.exec('grep -E "cat|dog" /test.txt');
    expect(result.stdout).toBe('cat\ndog\n');
    expect(result.stderr).toBe('');
  });

  it('should support extended regex with --extended-regexp', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'abc\nabc123\nxyz\n' },
    });
    const result = await env.exec('grep --extended-regexp "abc[0-9]+" /test.txt');
    expect(result.stdout).toBe('abc123\n');
    expect(result.stderr).toBe('');
  });

  it('should use -e to specify pattern', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'hello\nworld\n' },
    });
    const result = await env.exec('grep -e hello /test.txt');
    expect(result.stdout).toBe('hello\n');
    expect(result.stderr).toBe('');
  });

  it('should read from stdin', async () => {
    const env = new BashEnv();
    const result = await env.exec('echo -e "foo\\nbar\\nfoo" | grep foo');
    expect(result.stdout).toBe('foo\nfoo\n');
    expect(result.stderr).toBe('');
  });

  it('should error on missing pattern', async () => {
    const env = new BashEnv();
    const result = await env.exec('grep');
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('grep: missing pattern\n');
    expect(result.exitCode).toBe(2);
  });

  it('should error on missing file', async () => {
    const env = new BashEnv();
    const result = await env.exec('grep pattern /missing.txt');
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('grep: /missing.txt: No such file or directory\n');
    expect(result.exitCode).toBe(1);
  });

  it('should combine -in flags', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'Hello\nhello\n' },
    });
    const result = await env.exec('grep -in hello /test.txt');
    expect(result.stdout).toBe('1:Hello\n2:hello\n');
    expect(result.stderr).toBe('');
  });

  it('should show filename for multiple files', async () => {
    const env = new BashEnv({
      files: {
        '/a.txt': 'match\n',
        '/b.txt': 'match\n',
      },
    });
    const result = await env.exec('grep match /a.txt /b.txt');
    expect(result.stdout).toBe('/a.txt:match\n/b.txt:match\n');
    expect(result.stderr).toBe('');
  });

  it('should match literal text without regex interpretation', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'hello\nworld\nhello world\n' },
    });
    const result = await env.exec('grep "hello world" /test.txt');
    expect(result.stdout).toBe('hello world\n');
    expect(result.stderr).toBe('');
  });

  it('should skip directories in non-recursive mode', async () => {
    const env = new BashEnv({
      files: { '/dir/file.txt': 'content\n' },
    });
    const result = await env.exec('grep pattern /dir');
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('grep: /dir: Is a directory\n');
  });

  it('should count zero matches correctly with -c', async () => {
    const env = new BashEnv({
      files: { '/test.txt': 'no match here\n' },
    });
    const result = await env.exec('grep -c missing /test.txt');
    expect(result.stdout).toBe('0\n');
    expect(result.stderr).toBe('');
  });
});
