import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import jsdoc from "eslint-plugin-jsdoc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unicorn from "eslint-plugin-unicorn";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Generated files
    "**/*.generated.ts",
  ]),

  // =========================================================
  // CUSTOM RULES
  // =========================================================
  {
    rules: {
      "@typescript-eslint/explicit-function-return-type": "warn",

      "@typescript-eslint/no-explicit-any": "error",

      "@typescript-eslint/consistent-type-imports": "warn",

      "@typescript-eslint/no-unused-vars": "warn",

      "@typescript-eslint/naming-convention": [
        "error",

        // Functions
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },

        // Variables
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
        },

        // Types / Interfaces / Enums
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
      ],

      // Prefer function declarations but allow arrow functions
      "func-style": [
        "warn",
        "declaration",
        {
          allowArrowFunctions: true,
        },
      ],

      // Style
      semi: ["error", "always"],

      quotes: [
        "error",
        "double",
        {
          avoidEscape: true,
        },
      ],

      // React
      "react/react-in-jsx-scope": "off",

      "react/prop-types": "off",

      "react-hooks/rules-of-hooks": "error",

      "react-hooks/exhaustive-deps": "warn",

      "react/jsx-pascal-case": "error",
    },
  },

  // =========================================================
  // IMPORT SORTING
  // =========================================================
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      "simple-import-sort/imports": "warn",

      "simple-import-sort/exports": "error",
    },
  },

  // =========================================================
  // FILE NAMING CONVENTIONS
  // =========================================================
  {
    plugins: {
      unicorn,
    },

    rules: {
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            kebabCase: true,
          },
        },
      ],
    },
  },

  // =========================================================
  // JSDOC FOR SERVICE FILES
  // =========================================================
  {
    files: ["**/*-service.ts", "**/route.ts"],

    plugins: {
      jsdoc,
    },

    rules: {
      "jsdoc/require-jsdoc": [
        "warn",
        {
          contexts: ["ExportNamedDeclaration > FunctionDeclaration"],
        },
      ],

      "jsdoc/require-param": "warn",

      "jsdoc/require-returns": "warn",

      "jsdoc/require-description": "warn",

      "jsdoc/check-param-names": "error",

      // TypeScript already handles these
      "jsdoc/require-param-type": "off",

      "jsdoc/require-returns-type": "off",
    },
  },

  // =========================================================
  // TEST FILE OVERRIDES
  // =========================================================
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // =========================================================
  // ARCHITECTURAL BOUNDARIES
  // =========================================================

  {
    plugins: {
      boundaries,
    },

    settings: {
      "boundaries/elements": [
        // =====================================================
        // APP ROUTES
        // =====================================================

        {
          type: "app-home",
          pattern: "src/app/page.tsx",
        },

        {
          type: "app-contact",
          pattern: "src/app/contact/**",
        },

        {
          type: "app-blogs",
          pattern: "src/app/blogs/**",
        },

        {
          type: "app-works",
          pattern: "src/app/works/**",
        },

        // =====================================================
        // API ROUTES
        // =====================================================

        {
          type: "api-home",
          pattern: "src/app/api/route.ts",
        },

        {
          type: "api-contact",
          pattern: "src/app/api/contact/**",
        },

        {
          type: "api-blogs",
          pattern: "src/app/api/blogs/**",
        },

        {
          type: "api-works",
          pattern: "src/app/api/works/**",
        },

        // =====================================================
        // FEATURE SHARED PUBLIC API
        // =====================================================

        {
          type: "feature-shared",
          pattern: "src/features/*/shared/**",
        },

        // =====================================================
        // FEATURES
        // =====================================================

        {
          type: "feature-home",
          pattern: "src/features/home/**",
        },

        {
          type: "feature-contact",
          pattern: "src/features/contact/**",
        },

        {
          type: "feature-blogs",
          pattern: "src/features/blogs/**",
        },

        {
          type: "feature-works",
          pattern: "src/features/works/**",
        },

        // =====================================================
        // GLOBAL SHARED
        // =====================================================

        {
          type: "components",
          pattern: "src/components/**",
        },

        {
          type: "services",
          pattern: "src/services/**",
        },

        {
          type: "hooks",
          pattern: "src/hooks/**",
        },

        {
          type: "stores",
          pattern: "src/stores/**",
        },

        {
          type: "models",
          pattern: "src/{models,schemas}/**",
        },

        {
          type: "lib",
          pattern: "src/lib/**",
        },

        {
          type: "config",
          pattern: "src/config/**",
        },
      ],

      "boundaries/resolve": {
        alias: {
          "@": "./src",
        },
      },
    },

    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",

          rules: [
            // =================================================
            // GLOBAL SHARED ALLOW
            // =================================================

            // NOTE:
            // boundaries plugin doesn't support reusable constants
            // directly inside config objects cleanly,
            // so repeated explicitly for clarity.

            // =================================================
            // ROUTE -> FEATURE OWNERSHIP
            // =================================================

            {
              from: { type: "app-home" },

              allow: [
                { to: { type: "feature-home" } },
                { to: { type: "feature-shared" } },

                { to: { type: "components" } },
                { to: { type: "services" } },
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            {
              from: { type: "app-contact" },

              allow: [
                { to: { type: "feature-contact" } },
                { to: { type: "feature-shared" } },

                { to: { type: "components" } },
                { to: { type: "services" } },
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            {
              from: { type: "app-blogs" },

              allow: [
                { to: { type: "feature-blogs" } },
                { to: { type: "feature-shared" } },

                { to: { type: "components" } },
                { to: { type: "services" } },
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            {
              from: { type: "app-works" },

              allow: [
                { to: { type: "feature-works" } },
                { to: { type: "feature-shared" } },

                { to: { type: "components" } },
                { to: { type: "services" } },
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            // =================================================
            // API -> FEATURE OWNERSHIP
            // =================================================

            {
              from: { type: "api-home" },

              allow: [
                { to: { type: "feature-home" } },
                { to: { type: "feature-shared" } },

                { to: { type: "components" } },
                { to: { type: "services" } },
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            {
              from: { type: "api-contact" },

              allow: [
                { to: { type: "feature-contact" } },
                { to: { type: "feature-shared" } },

                { to: { type: "components" } },
                { to: { type: "services" } },
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            {
              from: { type: "api-blogs" },

              allow: [
                { to: { type: "feature-blogs" } },
                { to: { type: "feature-shared" } },

                { to: { type: "components" } },
                { to: { type: "services" } },
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            {
              from: { type: "api-works" },

              allow: [
                { to: { type: "feature-works" } },
                { to: { type: "feature-shared" } },

                { to: { type: "components" } },
                { to: { type: "services" } },
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            // =================================================
            // FEATURE RULES
            // =================================================

            {
              from: { type: "feature-home" },

              allow: [
                { to: { type: "feature-home" } },
                { to: { type: "feature-shared" } },

                { to: { type: "components" } },
                { to: { type: "services" } },
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            {
              from: { type: "feature-contact" },

              allow: [
                { to: { type: "feature-contact" } },
                { to: { type: "feature-shared" } },

                { to: { type: "components" } },
                { to: { type: "services" } },
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            {
              from: { type: "feature-blogs" },

              allow: [
                { to: { type: "feature-blogs" } },
                { to: { type: "feature-shared" } },

                { to: { type: "components" } },
                { to: { type: "services" } },
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            {
              from: { type: "feature-works" },

              allow: [
                { to: { type: "feature-works" } },
                { to: { type: "feature-shared" } },

                { to: { type: "components" } },
                { to: { type: "services" } },
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },
            // =================================================
            // GLOBAL SHARED RULES
            // =================================================

            {
              from: { type: "components" },

              allow: [
                { to: { type: "components" } },
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            {
              from: { type: "services" },

              allow: [
                { to: { type: "services" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            {
              from: { type: "hooks" },

              allow: [
                { to: { type: "hooks" } },
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
                { to: { type: "config" } },
              ],
            },

            {
              from: { type: "stores" },

              allow: [
                { to: { type: "stores" } },
                { to: { type: "models" } },
                { to: { type: "lib" } },
              ],
            },

            {
              from: { type: "lib" },

              allow: [
                { to: { type: "lib" } },
                { to: { type: "models" } },
                { to: { type: "config" } },
              ],
            },

            {
              from: { type: "models" },

              allow: [{ to: { type: "models" } }],
            },

            {
              from: { type: "config" },

              allow: [{ to: { type: "config" } }],
            },
          ],
        },
      ],

      "boundaries/no-unknown": "error",
    },
  },
]);

export default eslintConfig;
