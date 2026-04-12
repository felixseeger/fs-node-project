declare module 'drawflow' {
  export default class Drawflow {
    constructor(container: HTMLElement, render?: any, parent?: any);
    start(): void;
    import(data: any): void;
    export(): any;
    addNode(name: string, inputs: number, outputs: number, pos_x: number, pos_y: number, class_name: string, data: any, html: string, typenode?: string): number;
    removeNodeId(id: string): void;
    updateNodeValue(id: string): void;
    addConnection(id_output: number, id_input: number, output_class: string, input_class: string): void;
    removeConnection(id_output: number, id_input: number, output_class: string, input_class: string): void;
    on(event: string, callback: (...args: any[]) => void): void;
    clearModuleSelected(): void;
    zoom_in(): void;
    zoom_out(): void;
    zoom_reset(): void;
    static render: any;
    drawflow: any;
  }
}
