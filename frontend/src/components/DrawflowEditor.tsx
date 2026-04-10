import React, { useEffect, useRef, forwardRef, useImperativeHandle, CSSProperties } from 'react';
import Drawflow from 'drawflow';
import 'drawflow/dist/drawflow.min.css';

export interface DrawflowEditorRef {
  getEditor: () => any;
  export: () => any;
  import: (data: any) => void;
}

interface DrawflowEditorProps {
  onEditorReady?: (editor: any) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Mounts Drawflow on a child div created in useEffect so cleanup removes the DOM node
 * and drops event listeners (React StrictMode–safe).
 */
const DrawflowEditor = forwardRef<DrawflowEditorRef, DrawflowEditorProps>(
  function DrawflowEditor({ onEditorReady, className, style }, ref) {
    const hostRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<any>(null);
    const readyRef = useRef(onEditorReady);

    useEffect(() => {
      readyRef.current = onEditorReady;
    }, [onEditorReady]);

    useImperativeHandle(
      ref,
      () => ({
        getEditor: () => editorRef.current,
        export: () => editorRef.current?.export?.(),
        import: (data: any) => editorRef.current?.import?.(data),
      }),
      []
    );

    useEffect(() => {
      const host = hostRef.current;
      if (!host) return undefined;

      const mount = document.createElement('div');
      mount.className = 'drawflow-react-mount';
      mount.style.width = '100%';
      mount.style.height = '100%';
      host.appendChild(mount);

      const editor = new Drawflow(mount);
      editor.start();
      editorRef.current = editor;
      readyRef.current?.(editor);

      return () => {
        editorRef.current = null;
        mount.remove();
      };
    }, []);

    return (
      <div
        ref={hostRef}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          ...style,
        }}
      />
    );
  }
);

export default DrawflowEditor;
