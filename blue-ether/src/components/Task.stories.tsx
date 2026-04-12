import type { Meta, StoryObj } from "@storybook/react";
import { fn, expect, within } from "@storybook/test";

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

const defaultTask = {
  id: "1",
  title: "Test Task",
  state: "TASK_INBOX" as const,
};

export const Default: Story = {
  args: {
    task: defaultTask,
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const taskInput = canvas.getByRole('textbox');
    await expect(taskInput).toHaveValue('Test Task');
  }
};

export const Pinned: Story = {
  args: {
    task: {
      ...defaultTask,
      state: "TASK_PINNED",
    },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const pinButton = canvas.getByRole('button', { name: 'pinTask-1' });
    await expect(pinButton).toBeInTheDocument();
  }
};

export const Archived: Story = {
  args: {
    task: {
      ...defaultTask,
      state: "TASK_ARCHIVED",
    },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');
    await expect(checkbox).toBeChecked();
  }
};
