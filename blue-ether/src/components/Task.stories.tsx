import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import Task from "./Task";

export const ActionsData = {
  onArchiveTask: fn(),
  onPinTask: fn(),
};

const meta = {
  component: Task,
  title: "Components/Task",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
} satisfies Meta<typeof Task>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    task: {
      id: "1",
      title: "Test Task",
      state: "TASK_INBOX",
    },
  },
};

const defaultTask = {
  id: "1",
  title: "Test Task",
  state: "TASK_INBOX" as const,
};

export const Pinned: Story = {
  args: {
    task: {
      ...defaultTask,
      state: "TASK_PINNED",
    },
  },
};

export const Archived: Story = {
  args: {
    task: {
      ...defaultTask,
      state: "TASK_ARCHIVED",
    },
  },
};
