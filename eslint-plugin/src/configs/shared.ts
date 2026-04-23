import type { Linter } from 'eslint';

export function scopeConfigsToFiles(
  configs: readonly Linter.Config[],
  files: readonly string[],
): Linter.Config[] {
  return configs.map(config => ({
    ...config,
    files: [...files],
  }));
}
