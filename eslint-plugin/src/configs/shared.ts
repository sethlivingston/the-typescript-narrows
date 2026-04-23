import type { Linter } from 'eslint';

function clonePlainValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(entry => clonePlainValue(entry)) as T;
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, clonePlainValue(entry)]),
    ) as T;
  }

  return value;
}

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
          : { globals: clonePlainValue(config.languageOptions.globals) }),
        ...(config.languageOptions.parserOptions === undefined
          ? {}
          : {
            parserOptions: clonePlainValue(config.languageOptions.parserOptions),
          }),
      };
    }

    if (config.linterOptions !== undefined) {
      scopedConfig.linterOptions = clonePlainValue(config.linterOptions);
    }

    if (config.plugins !== undefined) {
      scopedConfig.plugins = { ...config.plugins };
    }

    if (config.rules !== undefined) {
      scopedConfig.rules = clonePlainValue(config.rules);
    }

    if (config.settings !== undefined) {
      scopedConfig.settings = clonePlainValue(config.settings);
    }

    return scopedConfig;
  });
}
