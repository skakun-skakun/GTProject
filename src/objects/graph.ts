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

    DFS(vertex: Vertex) {
        const visited = []
        const path = [vertex];
        let v: Vertex, broken: boolean = false;
        while (path.length > 0) {
            v = path[path.length - 1];
            if (!visited.includes(v)) {
                visited.push(v);
            }
            for (const edge of this.edges) {
                if (edge.vertices[0] == v && !visited.includes(edge.vertices[1])) {
                    path.push(edge.vertices[1]);
                    broken = true;
                    break;
                } else if (edge.vertices[1] == v && !visited.includes(edge.vertices[0])) {
                    path.push(edge.vertices[0]);
                    broken = true;
                    break;
                }
            }
            if (!broken) {
                path.pop();
            }
            broken = false;
        }
        return visited;
    }

    BFS(vertex: Vertex) {
        const visited = []
        const path = [vertex];
        let v: Vertex;
        while (path.length > 0) {
            v = path.pop();
            if (!visited.includes(v)) {
                visited.push(v);
                for (const edge of this.edges) {
                    if (edge.vertices[0] == v && !visited.includes(edge.vertices[1])) {
                        path.push(edge.vertices[1]);
                    } else if (edge.vertices[1] == v && !visited.includes(edge.vertices[0])) {
                        path.push(edge.vertices[0]);
                    }
                }
            }
        }
        return visited;
    }

    render(canv: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        ctx.shadowColor = "transparent";
        this.edges.forEach((e:Edge) => {e.render(canv, ctx)});
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20;
        this.vertices.forEach((v:Vertex) => {v.render(canv, ctx)});
    }
}
