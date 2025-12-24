# Agent instructions

- Install packages via pnpm rather than editing package.json directly
- Bias towards making new test files that are roughly logically grouped rather than letting test files gets too large. Try to stay below 300 lines. Prefer making a new file when you want to add a `describe()`
- Prefer asserting the full STDOUT/STDERR output rather than using to.contain or to.not.contain
- Always also add `comparison-tests` for major command functionality, but edge cases should always be covered in unit tests which are mush faster (`pnpm test:comparison`)
- When you are unsure about bash/command behavior, create a `comparison-tests` test file to ensure compat.
- `--help` does not need to pass comparison tests and should reflect actual capability
- Commands must handle unknown arguments correctly
- Always ensure all tests pass in the end and there are no compile and lint errors
- Use `pnpm lint:fix`
- Strongly prefer running a temporary comparison test or unit test over an ad-hoc script to figure out the behavior of some bash script or API.
- The implementation should align with the real behavior of bash, not what is convenient for TS or TE tests.
- Don't use `cat > test-direct.ts << 'SCRIPT'` style test scripts because they constantly require 1-off approval. Instead make comparison-tests and see what they output. event console.log is there is you remove later.
  - using `npx tsx -e '…` is another good option for adhoc testing.
- Always make sure to build before using dist
