export interface AttachedFunctionHandler {
  runReaderFns(): void;
  runArchitectFns(): void;
  runPreprocessorFns(): void;
  runPostprocessorFns(): void;
}
