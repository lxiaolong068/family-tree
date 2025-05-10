import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
// import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'; // Consider adding if next/core-web-vitals doesn't cover it well

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // resolvePluginsRelativeTo: __dirname, // Might be needed
});

export default tseslint.config(
  // Base Next.js rules (non-TS, non-React specific parts from it)
  // We hope this primarily brings in @next/eslint-plugin-next rules.
  // It might also bring older versions of react/react-hooks plugins, which we'll override.
  ...compat.extends("next/core-web-vitals"),

  // Global ignores - important to place early
  {
    ignores: [
        ".next/",
        "node_modules/",
        "dist/",
        "coverage/",
        "playwright-report/",
        "test-results/",
        "drizzle/",
        "*.config.js",
        "*.config.mjs",
        "scripts/",
        "jest.setup.js",
        ".DS_Store"
    ],
  },

  // TypeScript Configuration
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    extends: [
      ...tseslint.configs.recommended,
      // ...tseslint.configs.recommendedTypeChecked, // Enable for type-aware linting
      // ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Add any specific TS overrides here
      // e.g. "@typescript-eslint/no-explicit-any": "warn",
    }
  },

  // React Configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // Apply to all JS/TS files with JSX
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules, // For new JSX transform
      // Add any specific React overrides here
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
  },

  // React Hooks Configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
    },
  },
  
  // TODO: Add jsx-a11y if not adequately covered
  // {
  //   files: ['**/*.{js,jsx,ts,tsx}'],
  //   plugins: {
  //     'jsx-a11y': jsxA11yPlugin,
  //   },
  //   rules: {
  //     ...jsxA11yPlugin.configs.recommended.rules,
  //   }
  // },


  // Rule overrides / workarounds for next/core-web-vitals incompatibilities
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@next/next/no-duplicate-head": "off", // Workaround for ESLint 9 issue
      // If 'react-hooks/rules-of-hooks' from next/core-web-vitals still causes issues,
      // and our explicit config above doesn't fully override, we might need to also turn off
      // the specific version from next/core-web-vitals if it's aliased differently.
      // For now, hoping our explicit config for react-hooks takes over.
    }
  },
  
  // Prettier (optional, add last)
  // import eslintConfigPrettier from "eslint-config-prettier";
  // eslintConfigPrettier,
);
