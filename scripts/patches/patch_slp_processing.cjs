const fs = require('fs');

const path = 'frontend/src/components/SystemLoadingProcess.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add isProcessing to props
code = code.replace(
  /interface SystemLoadingProcessProps \{/,
  "interface SystemLoadingProcessProps {\n  isProcessing?: boolean;"
);

code = code.replace(
  /const SystemLoadingProcess: FC<SystemLoadingProcessProps> = \(\{/,
  "const SystemLoadingProcess: FC<SystemLoadingProcessProps> = ({\n  isProcessing = false,"
);

// 2. Add useEffect to watch isProcessing and set ready when it finishes (if timeline finished)
const watchProcessingCode = `
  const timelineFinishedRef = useRef(false);

  useEffect(() => {
    if (timelineFinishedRef.current && !isProcessing && !readyRef.current) {
      readyRef.current = true;
      setReady(true);
    }
  }, [isProcessing]);
`;

code = code.replace(
  /const rowLinesRef = useRef<\(HTMLSpanElement \| null\)\[\]>\(\[\]\);/,
  "const rowLinesRef = useRef<(HTMLSpanElement | null)[]>([]);\n" + watchProcessingCode
);

// 3. Update the timeline onComplete
code = code.replace(
  /onComplete: \(\) => \{\n\s*readyRef.current = true;\n\s*setReady\(true\);\n\s*\}/,
  `onComplete: () => {
          timelineFinishedRef.current = true;
          if (!isProcessing) {
            readyRef.current = true;
            setReady(true);
          }
        }`
);

// 4. Update the engage label text based on isProcessing
// Find the engage text mask
code = code.replace(
  /<MaskLine innerRef=\{labelLineRef\}>\n\s*\{ready \? <ScrambleText text=\{cfg.engageText\} \/> : cfg.engageText\}\n\s*<\/MaskLine>/,
  `<MaskLine innerRef={labelLineRef}>
              {ready ? <ScrambleText text={cfg.engageText} /> : (isProcessing ? <ScrambleText text="Processing..." /> : cfg.engageText)}
            </MaskLine>`
);

// 5. Ensure the button is only clickable if ready
code = code.replace(
  /onClick=\{handleEngage\}/,
  "onClick={ready ? handleEngage : undefined}"
);

fs.writeFileSync(path, code);
console.log("Patched SystemLoadingProcess with isProcessing");
