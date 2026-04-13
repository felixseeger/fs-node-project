# GIMP CLI Review for Layer Node Integration

**Target**: `/Users/felixseeger/Documents/_tools/gimp-cli`
**Goal**: Evaluate the GIMP CLI python tool to extract code patterns, logic, and architecture required for integrating a versatile "Layer Editor Node" in the Node-Project visual editor.

## 1. Overview of the `gimp-cli` Architecture

The `gimp-cli` project wraps the desktop GIMP application into a scriptable CLI environment. It functions via a **Subprocess Runner** pattern:
- It invokes GIMP in headless, batch mode.
- It leverages GIMP 3.x's `plug-in-script-fu-eval` interpreter to parse and execute Scheme (Lisp) expressions on the fly.
- It parses standard error (stderr) for output signals (e.g., `gimp-message`) because GIMP does not return structured JSON or stdout naturally.
- A critical finding in the `HARNESS.md` states: **GIMP startup overhead is ~5-10 seconds per launch**. Therefore, multiple layer operations must be batched into a single script string to avoid unacceptable delays in the Node-Project editor.

## 2. Capabilities Relevant to the Layer Node

The `Layer Editor Node` conceptually acts as a Photoshop/GIMP canvas. It takes a base image, adds an arbitrary number of overlay layers, applies translations (X/Y), scales, opacities, and filters, and then flattens them into a single output image.

The `gimp-cli` source code (`gimp/agent-harness/cli_anything/gimp/core/`) demonstrates precisely how to achieve this through Scheme strings.

### 2.1 Layer Compositing (`core/project.py`)
The `composite` function handles loading a base image and placing an overlay at specific X/Y offsets and opacities.

**Extracted Scheme Code (Adapted for Node.js String Interpolation)**:
```scheme
(let* ((base (car (gimp-file-load RUN-NONINTERACTIVE "/tmp/base.png" "base.png")))
       (overlay (car (gimp-file-load RUN-NONINTERACTIVE "/tmp/overlay.png" "overlay.png")))
       
       ;; Flatten the overlay just in case it has its own alpha/transparency oddities
       (overlay-layer (car (gimp-image-flatten overlay)))
       
       ;; Copy the overlay as a new layer inside the base image
       (copied-layer (car (gimp-layer-new-from-drawable overlay-layer base))))
  
  ;; Insert layer at the top (0)
  (gimp-image-insert-layer base copied-layer 0 -1)
  
  ;; Apply visual transformations
  (gimp-layer-set-offsets copied-layer {x_offset} {y_offset})
  (gimp-layer-set-opacity copied-layer {opacity_0_to_100})
  
  ;; (Optional - missing in CLI but easy to add) Blend modes:
  ;; (gimp-layer-set-mode copied-layer LAYER-MODE-MULTIPLY)
  
  ;; Flatten the final image to merge layers
  (let* ((drawable (car (gimp-image-flatten base))))
    (gimp-file-overwrite RUN-NONINTERACTIVE base "/tmp/final_output.png" drawable)
    (gimp-message "SUCCESS:composited"))
  
  ;; Memory cleanup is crucial to prevent hanging
  (gimp-image-delete overlay)
  (gimp-image-delete base))
```

### 2.2 Advanced Layer Filtering (`core/filters.py`)
GIMP 3.x allows applying *GEGL* nodes (Graph-based image processing) programmatically to individual layers before flattening them.

**Extracted Scheme Code**:
```scheme
(let* ((filter (car (gimp-drawable-filter-new copied-layer "gegl:gaussian-blur" "gegl:gaussian-blur"))))
  ;; Apply the GEGL parameters
  (gimp-drawable-filter-configure filter LAYER-MODE-REPLACE 1.0 "std-dev-x 5.0 std-dev-y 5.0")
  ;; Merge the filter into the layer
  (gimp-drawable-merge-filter copied-layer filter))
```

## 3. Recommended Implementation for the Layer Node

To implement the Layer Node in the Node-Project using the insights from this CLI:

### A. Backend Service (`api/services/gimpService.js`)
Instead of invoking the Python `gimp-cli` (which adds a layer of Python startup delay and dependency management), implement a `gimpService.js` that directly spawns GIMP.

1. **Batching**: The frontend `LayerEditorNode` passes an array of layers containing URLs, offsets, opacities, and blend modes. The backend downloads these into a `tmp` folder.
2. **Script Generation**: Dynamically construct a single Lisp script that loads the base layer, iteratively loads/copies every overlay layer, applies transformations, and flattens it.
3. **Execution**:
   ```javascript
   import { execFile } from 'child_process';
   import util from 'util';
   const execFileAsync = util.promisify(execFile);

   const script = `(let* (...) ... )`; // Generated from layers array
   
   // Run GIMP headless
   const { stdout, stderr } = await execFileAsync('/Applications/GIMP.app/Contents/MacOS/gimp', [
     '-i', '-s',
     '--batch-interpreter', 'plug-in-script-fu-eval',
     '-b', script,
     '--quit'
   ]);
   
   // Check stderr for (gimp-message "SUCCESS:composited")
   if (!stderr.includes('SUCCESS:composited')) throw new Error('GIMP failed: ' + stderr);
   ```

### B. Frontend Integration (`frontend/src/nodes/LayerEditorNode.tsx`)
1. The node maintains an array of `layers`, which users can sort (Z-index), translate (X/Y inputs or draggable canvas elements), and apply opacity to.
2. Clicking "Generate" or "Render" sends a payload to `POST /api/gimp/layer-composite`.
3. The UI should display a loading spinner for ~5-15 seconds (accounting for the 5-10s GIMP boot overhead).
4. The output is a single flattened image returned as a URL.

## 4. Strengths & Limitations

**Pros:**
- **Zero-cost local processing**: Infinite free image composition using standard GEGL operations (unlike cloud APIs).
- **Extremely versatile**: Any image manipulation can be done by chaining standard GIMP filters and properties.

**Cons:**
- **High Latency**: 5-10s boot overhead per node execution makes real-time slider manipulation impossible. It must remain an async "Submit -> Poll -> Complete" node.
- **LISP Syntax**: Constructing nested `let*` blocks dynamically in JavaScript can be error-prone and requires careful escaping of paths (e.g., replacing `\` and `"`).

## Summary

The `gimp-cli` repository successfully proves that GIMP 3.x can be entirely automated and treated as a backend image processor. By extracting the core `gimp-layer-*` and `gimp-drawable-filter-*` Script-Fu expressions, we can build a robust, multi-layer image editing node that rivals native Photoshop scripting without relying on the intermediate Python CLI layer.