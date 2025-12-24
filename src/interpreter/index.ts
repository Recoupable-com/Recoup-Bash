// Types
export type { InterpreterContext } from "./types.js";
export type { HereDocContext } from "./here-document.js";
export type { BuiltinContext } from "./builtins.js";
export type { ExpansionContext } from "./expansion.js";

// Control flow
export {
  executeIfStatement,
  parseIfStatement,
  executeForLoop,
  executeWhileLoop,
  executeUntilLoop,
} from "./control-flow.js";

// Case statements
export {
  executeCaseStatement,
  parseCaseStatement,
  matchCasePattern,
} from "./case-statement.js";

// Test expressions
export {
  evaluateTopLevelTest,
  tokenizeTestExpr,
  evaluateTestExpr,
  evaluateUnaryTest,
  evaluateBinaryTest,
  matchPattern,
  handleTestExpression,
} from "./test-expression.js";

// Here documents
export { executeWithHereDoc } from "./here-document.js";

// Variable and arithmetic expansion
export {
  expandVariablesSync,
  expandVariablesAsync,
  findMatchingParen,
  findMatchingDoubleParen,
  evaluateArithmetic,
  evalArithmeticExpr,
} from "./expansion.js";

// Builtin commands
export {
  handleCd,
  handleExport,
  handleUnset,
  handleLocal,
  handleExit,
  handleVariableAssignment,
} from "./builtins.js";
