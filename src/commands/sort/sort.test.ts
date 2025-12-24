import { describe, expect, it } from "vitest";
import { BashEnv } from "../../BashEnv.js";

describe("sort command", () => {
  const createEnv = () =>
    new BashEnv({
      files: {
        "/test/names.txt": "Charlie\nAlice\nBob\nDavid\n",
        "/test/numbers.txt": "10\n2\n1\n20\n5\n",
        "/test/duplicates.txt": "apple\nbanana\napple\ncherry\nbanana\n",
        "/test/columns.txt": "John 25\nAlice 30\nBob 20\nDavid 35\n",
        "/test/mixed.txt": "zebra\nalpha\nZebra\nAlpha\n",
      },
      cwd: "/test",
    });

  it("should sort lines alphabetically", async () => {
    const env = createEnv();
    const result = await env.exec("sort /test/names.txt");
    expect(result.stdout).toBe("Alice\nBob\nCharlie\nDavid\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should sort lines in reverse order with -r", async () => {
    const env = createEnv();
    const result = await env.exec("sort -r /test/names.txt");
    expect(result.stdout).toBe("David\nCharlie\nBob\nAlice\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should sort numerically with -n", async () => {
    const env = createEnv();
    const result = await env.exec("sort -n /test/numbers.txt");
    expect(result.stdout).toBe("1\n2\n5\n10\n20\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should sort numerically in reverse with -rn", async () => {
    const env = createEnv();
    const result = await env.exec("sort -rn /test/numbers.txt");
    expect(result.stdout).toBe("20\n10\n5\n2\n1\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should remove duplicates with -u", async () => {
    const env = createEnv();
    const result = await env.exec("sort -u /test/duplicates.txt");
    expect(result.stdout).toBe("apple\nbanana\ncherry\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should sort by key field with -k", async () => {
    const env = createEnv();
    const result = await env.exec("sort -k2 -n /test/columns.txt");
    expect(result.stdout).toBe("Bob 20\nJohn 25\nAlice 30\nDavid 35\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should read from stdin via pipe", async () => {
    const env = createEnv();
    const result = await env.exec('echo -e "c\\nb\\na" | sort');
    expect(result.stdout).toBe("a\nb\nc\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should handle case-sensitive sorting", async () => {
    const env = createEnv();
    const result = await env.exec("sort /test/mixed.txt");
    expect(result.stdout).toBe("alpha\nAlpha\nzebra\nZebra\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should return error for non-existent file", async () => {
    const env = createEnv();
    const result = await env.exec("sort /test/nonexistent.txt");
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe(
      "sort: /test/nonexistent.txt: No such file or directory\n",
    );
    expect(result.exitCode).toBe(1);
  });

  it("should handle empty input", async () => {
    const env = createEnv();
    const result = await env.exec('echo "" | sort');
    expect(result.stdout).toBe("\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should handle combined flags -nr", async () => {
    const env = createEnv();
    const result = await env.exec("sort -nr /test/numbers.txt");
    expect(result.stdout).toBe("20\n10\n5\n2\n1\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  describe("-f flag (case-insensitive)", () => {
    it("should sort case-insensitively with -f", async () => {
      const env = createEnv();
      const result = await env.exec("sort -f /test/mixed.txt");
      // Case-insensitive: alpha/Alpha should be together, zebra/Zebra together
      // The exact order within same-case groups depends on locale
      expect(result.stdout).toContain("alpha");
      expect(result.stdout).toContain("Alpha");
      expect(result.stdout).toContain("zebra");
      expect(result.stdout).toContain("Zebra");
      expect(result.exitCode).toBe(0);
    });

    it("should sort case-insensitively with --ignore-case", async () => {
      const env = new BashEnv({
        files: { "/test.txt": "Banana\napple\nCherry\n" },
      });
      const result = await env.exec("sort --ignore-case /test.txt");
      expect(result.stdout).toBe("apple\nBanana\nCherry\n");
      expect(result.exitCode).toBe(0);
    });

    it("should combine -f with -r for reverse case-insensitive", async () => {
      const env = new BashEnv({
        files: { "/test.txt": "apple\nBanana\ncherry\n" },
      });
      const result = await env.exec("sort -fr /test.txt");
      expect(result.stdout).toBe("cherry\nBanana\napple\n");
      expect(result.exitCode).toBe(0);
    });

    it("should combine -f with -u for unique case-insensitive", async () => {
      const env = new BashEnv({
        files: { "/test.txt": "Apple\napple\nBanana\nbanana\n" },
      });
      const result = await env.exec("sort -fu /test.txt");
      // Should have 2 unique entries (case-folded)
      const lines = result.stdout.trim().split("\n");
      expect(lines.length).toBe(2);
      expect(result.exitCode).toBe(0);
    });

    it("should work with -k field and -f", async () => {
      const env = new BashEnv({
        files: { "/test.txt": "1 Zebra\n2 apple\n3 BANANA\n" },
      });
      const result = await env.exec("sort -f -k2 /test.txt");
      expect(result.stdout).toBe("2 apple\n3 BANANA\n1 Zebra\n");
      expect(result.exitCode).toBe(0);
    });

    it("should show help with --help", async () => {
      const env = new BashEnv();
      const result = await env.exec("sort --help");
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("--ignore-case");
    });
  });
});
