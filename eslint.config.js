import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config(
  {
    ignores: [
      "dist",
      // Convex codegen output — never linted, and its eslint-disable
      // directives are always "unused" relative to our config.
      "src/convex/_generated/**",
    ],
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      eslintConfigPrettier,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    // shadcn/ui components intentionally export variant helpers and hooks
    // alongside components, and context files export hooks next to providers.
    // That pattern is fine for fast refresh in practice, so skip the rule.
    files: [
      "src/components/ui/**",
      "src/contexts/**",
      // Read-only platform file (Vly toolbar) — cannot be restructured.
      "vly-toolbar-readonly.tsx",
    ],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
);
