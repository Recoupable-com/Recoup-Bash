import { describe, it, expect } from 'vitest';
import { BashEnv } from '../../BashEnv.js';

describe('ls', () => {
  it('should list directory contents', async () => {
    const env = new BashEnv({
      files: {
        '/dir/a.txt': '',
        '/dir/b.txt': '',
      },
    });
    const result = await env.exec('ls /dir');
    expect(result.stdout).toBe('a.txt\nb.txt\n');
    expect(result.stderr).toBe('');
    expect(result.exitCode).toBe(0);
  });

  it('should list current directory by default', async () => {
    const env = new BashEnv({
      files: { '/file.txt': '' },
      cwd: '/',
    });
    const result = await env.exec('ls');
    expect(result.stdout).toBe('file.txt\n');
    expect(result.stderr).toBe('');
  });

  it('should hide hidden files by default', async () => {
    const env = new BashEnv({
      files: {
        '/dir/.hidden': '',
        '/dir/visible.txt': '',
      },
    });
    const result = await env.exec('ls /dir');
    expect(result.stdout).toBe('visible.txt\n');
    expect(result.stderr).toBe('');
  });

  it('should show hidden files with -a', async () => {
    const env = new BashEnv({
      files: {
        '/dir/.hidden': '',
        '/dir/visible.txt': '',
      },
    });
    const result = await env.exec('ls -a /dir');
    expect(result.stdout).toBe('.hidden\nvisible.txt\n');
    expect(result.stderr).toBe('');
  });

  it('should show hidden files with --all', async () => {
    const env = new BashEnv({
      files: { '/dir/.secret': '' },
    });
    const result = await env.exec('ls --all /dir');
    expect(result.stdout).toBe('.secret\n');
    expect(result.stderr).toBe('');
  });

  it('should support long format with -l', async () => {
    const env = new BashEnv({
      files: { '/dir/test.txt': '' },
    });
    const result = await env.exec('ls -l /dir');
    expect(result.stdout).toBe('total 1\n-rw-r--r-- 1 user user    0 Jan  1 00:00 test.txt\n');
    expect(result.stderr).toBe('');
  });

  it('should show directory indicator in long format', async () => {
    const env = new BashEnv({
      files: { '/dir/subdir/file.txt': '' },
    });
    const result = await env.exec('ls -l /dir');
    expect(result.stdout).toBe('total 1\ndrwxr-xr-x 1 user user    0 Jan  1 00:00 subdir/\n');
    expect(result.stderr).toBe('');
  });

  it('should combine -la flags', async () => {
    const env = new BashEnv({
      files: {
        '/dir/.hidden': '',
        '/dir/visible': '',
      },
    });
    const result = await env.exec('ls -la /dir');
    expect(result.stdout).toBe('total 2\n-rw-r--r-- 1 user user    0 Jan  1 00:00 .hidden\n-rw-r--r-- 1 user user    0 Jan  1 00:00 visible\n');
    expect(result.stderr).toBe('');
  });

  it('should list multiple directories', async () => {
    const env = new BashEnv({
      files: {
        '/dir1/a.txt': '',
        '/dir2/b.txt': '',
      },
    });
    const result = await env.exec('ls /dir1 /dir2');
    expect(result.stdout).toBe('/dir1:\na.txt\n\n/dir2:\nb.txt\n');
    expect(result.stderr).toBe('');
  });

  it('should list recursively with -R', async () => {
    const env = new BashEnv({
      files: {
        '/dir/subdir/file.txt': '',
        '/dir/root.txt': '',
      },
    });
    const result = await env.exec('ls -R /dir');
    expect(result.stdout).toBe('/dir:\nroot.txt\nsubdir\n\n/dir/subdir:\nfile.txt\n');
    expect(result.stderr).toBe('');
  });

  it('should error on missing directory', async () => {
    const env = new BashEnv();
    const result = await env.exec('ls /nonexistent');
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe("ls: cannot access '/nonexistent': No such file or directory\n");
    expect(result.exitCode).toBe(2);
  });

  it('should list a single file', async () => {
    const env = new BashEnv({
      files: { '/file.txt': 'content' },
    });
    const result = await env.exec('ls /file.txt');
    expect(result.stdout).toBe('/file.txt\n');
    expect(result.stderr).toBe('');
  });

  it('should handle glob pattern with find and grep workaround', async () => {
    const env = new BashEnv({
      files: {
        '/dir/a.txt': '',
        '/dir/b.txt': '',
        '/dir/c.md': '',
      },
    });
    const result = await env.exec('ls /dir | grep txt');
    expect(result.stdout).toBe('a.txt\nb.txt\n');
    expect(result.stderr).toBe('');
  });

  it('should sort entries alphabetically', async () => {
    const env = new BashEnv({
      files: {
        '/dir/zebra.txt': '',
        '/dir/apple.txt': '',
        '/dir/mango.txt': '',
      },
    });
    const result = await env.exec('ls /dir');
    expect(result.stdout).toBe('apple.txt\nmango.txt\nzebra.txt\n');
    expect(result.stderr).toBe('');
  });

  it('should handle empty directory', async () => {
    const env = new BashEnv({
      files: { '/empty/.keep': '' },
    });
    await env.exec('rm /empty/.keep');
    const result = await env.exec('ls /empty');
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('');
    expect(result.exitCode).toBe(0);
  });
});
