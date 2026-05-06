import { banEnums } from './ban-enums.js';
import { banBarrelFiles } from './ban-barrel-files.js';
import { noUnsafeTypeAssertion } from './no-unsafe-type-assertion.js';

export const rules = {
  'ban-enums': banEnums,
  'ban-barrel-files': banBarrelFiles,
  'no-unsafe-type-assertion': noUnsafeTypeAssertion,
};
