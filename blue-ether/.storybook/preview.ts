import type { Preview } from "@storybook/react-vite";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "ether",
      values: [{ name: "ether", value: "var(--be-color-bg)" }],
    },
  },
};

export default preview;
