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
      values: [
        { name: "ether", value: "var(--be-color-bg)" },
        { name: "canvas-dark", value: "#0b0e1a" },
        { name: "dark", value: "#111" },
        { name: "light", value: "#f8f8f8" },
      ],
    },
  },
};

export default preview;
