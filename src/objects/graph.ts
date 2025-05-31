import { Vertex } from "./vertex.ts"
import { Edge } from "./edge.ts"


export class Graph {
    constructor(public vertices: Vertex[], public edges: Edge[]) {
        this.vertices = vertices;
        this.edges = edges;
    }

    getEdge(vertex1: Vertex, vertex2: Vertex): Edge | null {
        for (const edge of this.edges) {
            if ((edge.vertices[0] == vertex1 && edge.vertices[1] == vertex2) || (edge.vertices[0] == vertex2 && edge.vertices[1] == vertex1))
                return edge;
        }
        return null
    }

    adjacencyMatrix() {
        const matrix = [];
        for (const u of this.vertices) {
            matrix.push(this.vertices.map(v => this.getEdge(u, v) !== undefined));
        }
        return matrix
    }

    incidenceMatrix() {
        const matrix = [];
        for (const u of this.vertices) {
            matrix.push(this.edges.map(e => e.vertices.includes(u)));
        }
        return matrix
    }

    render(canv: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        ctx.shadowColor = "transparent";
        this.edges.forEach((e:Edge) => {e.render(canv, ctx)});
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20;
        this.vertices.forEach((v:Vertex) => {v.render(canv, ctx)});
    }
}
