import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
const config = [
    ...nextJsConfig,
    {
        ignores: [".next/**", "next-env.d.ts"],
    }
];

export default config;
