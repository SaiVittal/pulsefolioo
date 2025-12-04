import react from "eslint-plugin-react";
export default defineConfig([
  globalIgnores(["dist"]),

  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: react,                     // <-- ADD THIS
      reactHooks: reactHooks,
      reactRefresh: reactRefresh
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.recommended,         // <-- ADD THIS
      reactHooks.configs.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },     // <-- IMPORTANT
        sourceType: "module",
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      react: {
        version: "detect",               // <-- IMPORTANT
      },
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "no-undef": "error",
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true }
      ],
      "react/react-in-jsx-scope": "off", // Required for React 17+
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
]);
