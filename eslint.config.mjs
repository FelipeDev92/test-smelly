import jest from "eslint-plugin-jest";
import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  pluginJs.configs.recommended,
  {
    // Aplica as regras globais do Node para todo o projeto
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Configurações específicas para os arquivos de teste
    files: ["**/*.test.js", "**/*.spec.js"],
    plugins: {
      jest: jest,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...jest.environments.globals.globals,
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
      },
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-conditional-expect": "error",
      "jest/no-identical-title": "error",
    },
  },
];