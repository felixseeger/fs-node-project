import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    // Blue-Ether design system components
    "../src/components/**/*.stories.@(ts|tsx)",
    // Frontend UI components
    "../src/frontend-stories/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  async viteFinal(config) {
    const frontendSrc = path.resolve(__dirname, "../../frontend/src");
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...(config.resolve?.alias ?? {}),
          "@": frontendSrc,
          "@config": path.resolve(frontendSrc, "config"),
          "@hooks": path.resolve(frontendSrc, "hooks"),
          "@helpers": path.resolve(frontendSrc, "helpers"),
          "@constants": path.resolve(frontendSrc, "constants"),
          "@nodes": path.resolve(frontendSrc, "nodes"),
          "@utils": path.resolve(frontendSrc, "utils"),
          // Stub heavy deps that don't work in Storybook
          "@paper-design/shaders": path.resolve(
            __dirname,
            "../src/stubs/paper-shaders.ts"
          ),
        },
      },
    };
  },
};

export default config;
