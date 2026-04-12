import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import {
  Pill,
  Toggle,
  Slider,
  PromptInput,
  TextInput,
  SettingsPanel,
  PillGroup,
} from "@/nodes/NodeControls";

/* ─── Pill ─── */

const PillMeta = {
  title: "Frontend/Nodes/Controls/Pill",
  component: Pill,
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  tags: ["autodocs"],
  args: { onClick: fn() },
} satisfies Meta<typeof Pill>;

export default PillMeta;
type PillStory = StoryObj<typeof PillMeta>;

export const PillInactive: PillStory = {
  args: { label: "1024×1024", isActive: false },
};

export const PillActive: PillStory = {
  args: { label: "1024×1024", isActive: true },
};

export const PillWithAccent: PillStory = {
  args: { label: "SDXL", isActive: true, accentColor: "#ffd27f" },
};

/* ─── PillGroup ─── */

const PillGroupControlled = () => {
  const [active, setActive] = useState("1024×1024");
  const options = ["512×512", "1024×1024", "1536×1024"];
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {options.map((o) => (
        <Pill key={o} label={o} isActive={active === o} onClick={() => setActive(o)} />
      ))}
    </div>
  );
};

export const PillGroupInteractive: PillStory = {
  render: () => <PillGroupControlled />,
  args: { label: "", isActive: false },
};

/* ─── Toggle ─── */

const ToggleControlled = () => {
  const [on, setOn] = useState(false);
  return <Toggle label="High Quality" checked={on} onChange={setOn} />;
};

export const ToggleOff: PillStory = {
  render: () => <Toggle label="Feature" checked={false} onChange={fn()} />,
  args: { label: "", isActive: false },
};

export const ToggleOn: PillStory = {
  render: () => <Toggle label="Feature" checked={true} onChange={fn()} />,
  args: { label: "", isActive: false },
};

export const ToggleInteractive: PillStory = {
  render: () => <ToggleControlled />,
  args: { label: "", isActive: false },
};

/* ─── Slider ─── */

const SliderControlled = () => {
  const [val, setVal] = useState(50);
  return (
    <div style={{ width: 280 }}>
      <Slider label="Steps" value={val} onChange={setVal} min={1} max={100} step={1} />
    </div>
  );
};

export const SliderDefault: PillStory = {
  render: () => <SliderControlled />,
  args: { label: "", isActive: false },
};

/* ─── PromptInput ─── */

export const PromptInputDefault: PillStory = {
  render: () => (
    <div style={{ width: 300 }}>
      <PromptInput value="" onChange={fn()} placeholder="Describe your image..." />
    </div>
  ),
  args: { label: "", isActive: false },
};

/* ─── TextInput ─── */

export const TextInputDefault: PillStory = {
  render: () => (
    <div style={{ width: 300 }}>
      <TextInput value="hello" onChange={fn()} label="Seed" />
    </div>
  ),
  args: { label: "", isActive: false },
};

/* ─── SettingsPanel ─── */

export const SettingsPanelExample: PillStory = {
  render: () => (
    <div style={{ width: 300 }}>
      <SettingsPanel title="Generation Settings">
        <Toggle label="HD Mode" checked={true} onChange={fn()} />
        <Slider label="CFG Scale" value={7} onChange={fn()} min={1} max={20} />
      </SettingsPanel>
    </div>
  ),
  args: { label: "", isActive: false },
};
