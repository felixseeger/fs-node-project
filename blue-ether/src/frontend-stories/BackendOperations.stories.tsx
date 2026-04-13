import type { Meta, StoryObj } from "@storybook/react";
import { 
  LogTerminal, 
  InfrastructureStatus, 
  PropertyGrid,
  NodeShell
} from "../components/nodes";
import { withReactFlow } from "./decorators/ReactFlowDecorator";

const meta = {
  title: "Frontend/Backend/Operations",
  parameters: {
    layout: "centered",
    backgrounds: { default: "canvas-dark" },
  },
  decorators: [withReactFlow],
} satisfies Meta;

export default meta;

export const NanoBanana2Pro: StoryObj = {
  render: () => (
    <div style={{ width: 600 }}>
      <NodeShell label="Nano Banana 2 Pro (Google)" dotColor="var(--color-brand-google)">
        <div style={{ padding: 12 }}>
          <PropertyGrid 
            title="JSON PROMPT SPEC"
            properties={[
              { key: 'Subject', value: 'Cosmic AI constellation', type: 'text' },
              { key: 'Composition', value: 'Centered, wide-angle', type: 'text' },
              { key: 'Lighting', value: 'Cinematic, bioluminescent', type: 'text' },
              { key: 'Style', value: 'Hyper-realistic 3D render', type: 'text' },
              { key: 'Engine', value: 'Imagen 4 + Gemini 3 Pro', type: 'tag' },
            ]}
          />
          <div style={{ marginTop: 12 }}>
            <LogTerminal 
              title="GOOGLE CLOUD VERTEX EXECUTION"
              logs={[
                { id: 1, timestamp: new Date(), level: 'info', message: 'Validating JSON schema for Nano Banana 2 Pro...' },
                { id: 2, timestamp: new Date(), level: 'info', message: 'Input accepted. Mapping properties to latent space vectors...' },
                { id: 3, timestamp: new Date(), level: 'debug', message: 'imagen4-api: initiating multi-stage diffusion process' },
                { id: 4, timestamp: new Date(), level: 'success', message: 'Artifact generated: gs://blue-ether-bucket/gen-7721.png' },
              ]}
              maxHeight={150}
            />
          </div>
        </div>
      </NodeShell>
    </div>
  )
};

export const MultimodalPipeline: StoryObj = {
  render: () => (
    <div style={{ width: 800 }}>
      <LogTerminal 
        title="SYSTEM-WIDE PIPELINE EXECUTION"
        logs={[
          { id: 1, timestamp: "10:15:02", level: 'info', message: '[Frontend] User triggered "Cinematic Trailer" workflow' },
          { id: 2, timestamp: "10:15:03", level: 'info', message: '[ImageGen] Nano Banana 2: Starting base scene generation...' },
          { id: 3, timestamp: "10:15:15", level: 'success', message: '[ImageGen] Scene complete. (12.4s)' },
          { id: 4, timestamp: "10:15:16", level: 'info', message: '[VideoGen] Kling 3: Animating scene (5s duration)...' },
          { id: 5, timestamp: "10:15:45", level: 'success', message: '[VideoGen] Video encoding complete. (29.1s)' },
          { id: 6, timestamp: "10:15:46", level: 'info', message: '[AudioGen] ElevenLabs: Generating narration + SFX...' },
          { id: 7, timestamp: "10:15:52", level: 'success', message: '[AudioGen] Audio mixed. Pipeline finished.' },
          { id: 8, timestamp: "10:15:53", level: 'info', message: '[System] Saving result to Firebase Firestore: wf_9921...' },
        ]}
        maxHeight={400}
      />
    </div>
  )
};

export const NanoBanana2Edit: StoryObj = {
  render: () => (
    <div style={{ width: 600 }}>
      <NodeShell label="Nano Banana 2 Edit (Editing)" dotColor="var(--color-brand-pink)">
        <div style={{ padding: 12 }}>
          <PropertyGrid 
            title="EDITING PARAMETERS"
            properties={[
              { key: 'Model', value: 'Precision Upscale', type: 'tag' },
              { key: 'Scale Factor', value: '4x', type: 'text' },
              { key: 'Sharpen', value: 7, type: 'number' },
              { key: 'Creativity', value: 0.15, type: 'number' },
              { key: 'Skin Mode', value: 'Faithful', type: 'text' },
            ]}
          />
          <div style={{ marginTop: 12 }}>
            <LogTerminal 
              title="RETOUCHING ENGINE LOGS"
              logs={[
                { id: 1, timestamp: new Date(), level: 'info', message: 'Downloading source image from cloud storage...' },
                { id: 2, timestamp: new Date(), level: 'info', message: 'Applying Precision Upscale (4x)...' },
                { id: 3, timestamp: new Date(), level: 'debug', message: 'retouch-v4: processing skin texture layers' },
                { id: 4, timestamp: new Date(), level: 'info', message: 'Sharpening high-frequency details (level 7)...' },
                { id: 5, timestamp: new Date(), level: 'success', message: 'Image processed successfully. (4.8s)' },
              ]}
              maxHeight={150}
            />
          </div>
        </div>
      </NodeShell>
    </div>
  )
};

export const InfrastructureHealth: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
      <InfrastructureStatus 
        name="Imagen 4 (Google)"
        status="online"
        metrics={[
          { label: 'Latency', value: 3.2, unit: 's', status: 'success' },
          { label: 'Queue', value: 0, unit: 'req' },
          { label: 'Rate Limit', value: 95, unit: '%' },
        ]}
        lastUpdated={new Date()}
      />
      <InfrastructureStatus 
        name="Kling 3 Video"
        status="degraded"
        metrics={[
          { label: 'Latency', value: 45, unit: 's', status: 'warning' },
          { label: 'Load', value: 88, unit: '%', status: 'warning' },
          { label: 'GPU clusters', value: 12, unit: 'active' },
        ]}
        lastUpdated={new Date()}
      />
      <InfrastructureStatus 
        name="ElevenLabs Voice"
        status="online"
        metrics={[
          { label: 'Latency', value: 850, unit: 'ms', status: 'success' },
          { label: 'Remaining', value: 45200, unit: 'credits' },
        ]}
        lastUpdated={new Date()}
      />
    </div>
  )
};

export const PromptRefinement: StoryObj = {
  render: () => (
    <div style={{ width: 500 }}>
      <NodeShell label="Prompt Improver" dotColor="var(--color-brand-kling)">
        <div style={{ padding: 12 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: 'var(--be-color-text-muted)', fontWeight: 600 }}>INPUT PROMPT</span>
            <div style={{ 
              padding: 8, 
              background: 'rgba(0,0,0,0.3)', 
              borderRadius: 4, 
              fontSize: 12, 
              color: '#ddd',
              marginTop: 4,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              "A picture of myself"
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-kling)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
            </svg>
          </div>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: 'var(--be-color-text-muted)', fontWeight: 600 }}>REFINED PROMPT (GEMINI 3 PRO)</span>
            <div style={{ 
              padding: 8, 
              background: 'rgba(0, 209, 255, 0.1)', 
              borderRadius: 4, 
              fontSize: 12, 
              color: 'var(--color-brand-kling)',
              marginTop: 4,
              border: '1px solid var(--color-brand-kling)'
            }}>
              {"{\"subject\": \"Professional cinematic headshot of a developer, artistic depth of field, soft warm lighting, sharp focus, 8k resolution, photorealistic style\", \"background\": \"Modern tech workspace with soft bokeh\"}"}
            </div>
          </div>
        </div>
      </NodeShell>
    </div>
  )
};
