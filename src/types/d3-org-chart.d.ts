declare module "d3-org-chart" {
  export class OrgChart<T = unknown> {
    constructor();
    container(el: string | HTMLElement): this;
    data(data: T[]): this;
    nodeWidth(fn: (d: unknown) => number): this;
    nodeHeight(fn: (d: unknown) => number): this;
    childrenMargin(fn: (d: unknown) => number): this;
    compactMarginBetween(fn: (d: unknown) => number): this;
    compactMarginPair(fn: (d: unknown) => number): this;
    siblingsMargin(fn: (d: unknown) => number): this;
    neighbourMargin(fn: (d: unknown) => number): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodeContent(fn: (d: any) => string): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    linkUpdate(fn: (this: SVGPathElement, d: any, i: number, nodes: SVGPathElement[]) => void): this;
    expandAll(): this;
    collapseAll(): this;
    setExpanded(nodeId: string, expanded: boolean): this;
    render(): this;
    fit(): this;
  }
}
