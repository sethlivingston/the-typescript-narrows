import type { Linter } from 'eslint';

export function scopeConfigsToFiles(
  configs: readonly Linter.Config[],
  files: readonly string[],
): Linter.Config[] {
  return configs.map(config => {
    const scopedConfig: Linter.Config = {
      ...config,
      files: [...files],
    };

    if (config.languageOptions !== undefined) {
      scopedConfig.languageOptions = {
        ...config.languageOptions,
        ...(config.languageOptions.globals === undefined
          ? {}
          : { globals: { ...config.languageOptions.globals } }),
        ...(config.languageOptions.parserOptions === undefined
          ? {}
          : { parserOptions: { ...config.languageOptions.parserOptions } }),
      };
    }

    if (config.linterOptions !== undefined) {
      scopedConfig.linterOptions = { ...config.linterOptions };
    }

    if (config.plugins !== undefined) {
      scopedConfig.plugins = { ...config.plugins };
    }

    if (config.rules !== undefined) {
      scopedConfig.rules = { ...config.rules };
    }

    if (config.settings !== undefined) {
      scopedConfig.settings = { ...config.settings };
    }

    return scopedConfig;
  });
}
