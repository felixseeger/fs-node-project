# SystemLoadingProcess Component

A cyberpunk/sci-fi themed preloader animation with a circular "Engage" button and progress ring.

## Features

- **GSAP-powered animations** - Smooth timeline-based animations with custom easing
- **Configurable content** - Customize all text, phases, and branding
- **Accessible** - Keyboard navigation and ARIA labels
- **Responsive** - Mobile-optimized with progressive disclosure
- **Theme support** - Dark and light variants
- **Reduced motion support** - Respects `prefers-reduced-motion`

## Usage

### Basic Usage

```jsx
import SystemLoadingProcess from './components/SystemLoadingProcess';

function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  if (showPreloader) {
    return (
      <SystemLoadingProcess 
        onComplete={() => setShowPreloader(false)}
      />
    );
  }

  return <MainApp />;
}
```

### With Custom Configuration

```jsx
<SystemLoadingProcess 
  onComplete={() => setShowPreloader(false)}
  config={{
    title: 'Initializing',
    phases: [
      { label: 'Loading', value: 'Assets' },
      { label: 'Connecting', value: 'Server' },
    ],
    code: 'V2.0',
    engageText: 'Enter',
    successText: 'Welcome',
    backdropTop: [
      ['System // Online'],
      ['Version 2.0.1'],
    ],
    backdropBottom: [
      ['Ready'],
      ['Status: Active'],
    ],
  }}
  theme="dark"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onComplete` | `Function` | - | Callback when preloader finishes |
| `autoStart` | `boolean` | `true` | Auto-start the animation |
| `config` | `Object` | See below | Content configuration |
| `theme` | `'dark' \| 'light'` | `'dark'` | Color theme |

### Config Object

```typescript
interface Config {
  title: string;           // Main title text
  phases: Array<{         // Phase labels
    label: string;
    value: string;
  }>;
  code: string;           // Code/identifier
  engageText: string;     // Button text
  successText: string;    // Success message
  logoSrc: string;        // Logo image path
  backdropTop: string[][];    // Top backdrop rows
  backdropBottom: string[][]; // Bottom backdrop rows
}
```

### CSS Custom Properties

Override these CSS variables to customize the appearance:

```css
:root {
  --slp-z-preloader: 2;
  --slp-color-white: #ffffff;
  --slp-color-black: #000000;
  --slp-color-gray: #7a7a7a;
  --slp-btn-size: 20rem;
}
```

## Animation Sequence

1. **Text reveal** - Lines animate in with mask reveal (0.75s staggered)
2. **Track draw** - SVG circle track animates in (2s)
3. **Progress simulation** - Progress ring fills with randomized stops (2.5s)
4. **Logo fade** - Logo fades out (0.35s)
5. **Button scale** - Button scales down (1.5s)
6. **Engage reveal** - "Engage" text appears (0.75s)

### Exit Sequence (on click)

1. **Preloader scale** - Scales down (1.25s)
2. **Stroke exit** - Progress strokes animate out (1.25s)
3. **Text swap** - "Engage" exits, "Access Granted" enters (0.75s)
4. **Wipe reveal** - Clip-path wipe to reveal content (1.5s)

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- iOS Safari 14+

## Dependencies

- `gsap` - Animation library
- CustomEase plugin (included)
