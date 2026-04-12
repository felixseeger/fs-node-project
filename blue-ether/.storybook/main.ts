import type { StorybookConfig } from "@storybook/react-vite";
import { resolve } from "node:path";

const config: StorybookConfig = {
  stories: [
    "../src/components/**/*.stories.@(ts|tsx)",
    "../src/frontend-stories/**/*.stories.@(ts|tsx)"
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  async viteFinal(config) {
    const frontendSrc = resolve(process.cwd(), "../frontend/src");
    
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...(config.resolve?.alias ?? {}),
          "@": frontendSrc,
          "@config": resolve(frontendSrc, "config"),
          "@hooks": resolve(frontendSrc, "hooks"),
          "@helpers": resolve(frontendSrc, "helpers"),
          "@constants": resolve(frontendSrc, "constants"),
          "@nodes": resolve(frontendSrc, "nodes"),
          "@utils": resolve(frontendSrc, "utils"),
          "@paper-design/shaders": resolve(
            process.cwd(),
            "src/stubs/paper-shaders.ts"
          ),
        },
      },
    };
  },
};

export default config;
