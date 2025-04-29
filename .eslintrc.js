module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Disable specific rules that are causing issues
    '@typescript-eslint/no-unused-vars': 'warn', // Downgrade to warning instead of error
    '@typescript-eslint/no-explicit-any': 'warn', // Downgrade to warning
    '@typescript-eslint/no-empty-object-type': 'off', // Turn off the empty interface error
    'react-hooks/exhaustive-deps': 'warn', // Downgrade to warning
  },
  // Add overrides for specific files if needed
  overrides: [
    {
      // Disable specific rules for test files
      files: ['**/tests/**/*.ts', '**/tests/**/*.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      }
    },
    {
      // Disable specific rules for dynamic route pages
      files: ['**/app/**/[*]/**/*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      }
    }
  ]
};
