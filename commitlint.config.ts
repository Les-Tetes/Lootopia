import { RuleConfigSeverity } from '@commitlint/types';

import type { UserConfig } from '@commitlint/types';

const MAX_LINE_LENGTH = 100;

// Conventional Commits, as required by the specification (§ 11.1).
const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    'scope-case': [RuleConfigSeverity.Error, 'always', 'kebab-case'],
    'subject-case': [
      RuleConfigSeverity.Error,
      'never',
      ['upper-case', 'pascal-case', 'start-case'],
    ],
    'header-max-length': [RuleConfigSeverity.Error, 'always', MAX_LINE_LENGTH],
    'body-max-line-length': [RuleConfigSeverity.Error, 'always', MAX_LINE_LENGTH],
  },
};

export default config;
