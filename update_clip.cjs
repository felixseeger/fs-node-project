const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/TimelineClip.tsx', 'utf-8');

content = content.replace(
  "import { useTimeline } from '../contexts/TimelineContext';",
  "import { useTimeline } from '../contexts/TimelineContext';\nimport { KeyframeLane } from './KeyframeLane';"
);

content = content.replace(
  "const [isTrimmingEnd, setIsTrimmingEnd] = useState(false);",
  "const [isTrimmingEnd, setIsTrimmingEnd] = useState(false);\n  const [showKeyframes, setShowKeyframes] = useState(false);"
);

content = content.replace(
  "    <div \n      ref={clipRef}\n      className=\"absolute h-full rounded shadow-sm overflow-visible flex group\"\n      style={{ \n        left: `${left}%`, \n        width: `${width}%`,\n        zIndex: isDragging ? 50 : 10,\n        boxShadow: isDragging ? '0 0 0 2px #fff' : undefined,\n        cursor: isDragging ? 'grabbing' : 'grab'\n      }}\n      onPointerDown={(e) => handlePointerDown(e, 'drag')}\n      onPointerMove={handlePointerMove}\n      onPointerUp={handlePointerUp}\n      onPointerCancel={handlePointerUp}\n    >",
  `    <div 
      className="absolute flex flex-col"
      style={{ 
        left: \`\${left}%\`, 
        width: \`\${width}%\`,
        zIndex: isDragging ? 50 : 10,
        height: showKeyframes ? 'auto' : '100%'
      }}
    >
      <div 
        ref={clipRef}
        className="relative h-10 w-full rounded shadow-sm overflow-visible flex group"
        style={{ 
          boxShadow: isDragging ? '0 0 0 2px #fff' : undefined,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onPointerDown={(e) => handlePointerDown(e, 'drag')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={(e) => { e.stopPropagation(); setShowKeyframes(!showKeyframes); }}
      >`
);

content = content.replace(
  "          {clip.type}\n        </div>\n      </div>",
  "          {clip.type} {Object.keys(clip.keyframes || {}).length > 0 ? '✨' : ''}\n        </div>\n      </div>"
);

content = content.replace(
  "      />\n    </div>\n  );\n};",
  "      />\n    </div>\n\n    {showKeyframes && (\n      <KeyframeLane \n        clip={clip} \n        trackId={trackId} \n        durationInFrames={durationInFrames} \n      />\n    )}\n    </div>\n  );\n};"
);

fs.writeFileSync('frontend/src/components/TimelineClip.tsx', content);
