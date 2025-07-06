import { Vertex } from "./vertex.ts"
import { Edge } from "./edge.ts"


export class Graph {
    constructor(public vertices: Vertex[], public edges: Edge[]) {
        this.vertices = vertices;
        this.edges = edges;
    }

    possibleVertexName() {
        let i = 1, broken=false;
        while (true) {
            broken = false;
            for (const v of this.vertices) {
                if (v.name.includes(i)) {
                    i++;
                    broken = true;
                }
            }
            if (broken)
                continue;
            break;
        }
        return "v" + i;
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
            matrix.push(this.vertices.map(v => this.getEdge(u, v) !== null));
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
        let v: Vertex;
        while (path.length > 0) {
            v = path.pop();
            if (!visited.includes(v)) {
                visited.push(v);
            }
            for (const edge of this.edges) {
                if (edge.vertices[0] == v && !visited.includes(edge.vertices[1])) {
                    path.push(v);
                    path.push(edge.vertices[1]);
                    break;
                } else if (edge.vertices[1] == v && !visited.includes(edge.vertices[0])) {
                    path.push(v);
                    path.push(edge.vertices[0]);
                    break;
                }
            }
        }
        return visited;
    }

    BFS(vertex: Vertex) {
        const visited = [vertex]
        const path = []
        const queue = [vertex];
        let v: Vertex;
        while (queue.length > 0) {
            v = queue.shift();
            path.push(v);
            for (const edge of this.edges) {
                if (edge.vertices[0] === v && !visited.includes(edge.vertices[1])) {
                    visited.push(edge.vertices[1]);
                    queue.push(edge.vertices[1]);
                } else if (edge.vertices[1] === v && !visited.includes(edge.vertices[0])) {
                    visited.push(edge.vertices[0]);
                    queue.push(edge.vertices[0]);
                }
            }
        }
        return path;
    }

    eccentricity(vertex: Vertex) {
        const queue = [[vertex, 0]];
        const distances = []
        const visited = [vertex];

        while (queue.length > 0) {
            const [v, distance] = queue.shift();
            distances.push(distance);
            for (const edge of this.edges) {
                if (edge.vertices[0] === v && !visited.includes(edge.vertices[1])) {
                    visited.push(edge.vertices[1]);
                    queue.push([edge.vertices[1], distance + 1]);
                } else if (edge.vertices[1] === v && !visited.includes(edge.vertices[0])) {
                    visited.push(edge.vertices[0]);
                    queue.push([edge.vertices[0], distance + 1]);
                }
            }
        }

        return Math.max(...distances, 0);
    }

    connectedComponents() {
        if (this.vertices.length === 0)
            return [[]];
        const comps = [[...this.vertices]];
        let component;
        while (true) {
            component = this.DFS(comps[0][0])
            if (component.length === comps[0].length)
                break;
            comps[0] = comps[0].filter(v => !component.includes(v));
            comps.push(component);
        }
        return comps
    }

    center(comp) {
        const center = [];
        let minD = this.vertices.length, ecc;
        for (const v of comp) {
            ecc = this.eccentricity(v);
            if (ecc == minD) center.push(v)
            else if (ecc < minD) {
                minD = ecc;
                center.length = 0;
                center.push(v);
            }
        }
        return center;
    }

    periphery(comp) {
        const periphery = [];
        let maxD = 0, ecc;
        for (const v of comp) {
            ecc = this.eccentricity(v);
            if (ecc == maxD) periphery.push(v)
            else if (ecc > maxD) {
                maxD = ecc;
                periphery.length = 0;
                periphery.push(v);
            }
        }
        return periphery;
    }

    bipartition(comp) {
        const queue = [[comp[0], 0]];
        const bipartition = [[], []];
        // const distances = []
        bipartition[0].push(comp[0]);
        while (queue.length > 0) {
            const [v, bipartInd] = queue.shift();
            for (const edge of this.edges) {
                if (edge.vertices[0] === v) {
                    if (bipartition[bipartInd].includes(edge.vertices[1]))
                        return -1
                    else if (!bipartition[(bipartInd+1)%2].includes(edge.vertices[1])) {
                        bipartition[(bipartInd+1)%2].push(edge.vertices[1]);
                        queue.push([edge.vertices[1], (bipartInd+1)%2])
                    }
                } else if (edge.vertices[1] === v) {
                    if (bipartition[bipartInd].includes(edge.vertices[0]))
                        return -1
                    else if (!bipartition[(bipartInd+1)%2].includes(edge.vertices[0])) {
                        bipartition[(bipartInd+1)%2].push(edge.vertices[0]);
                        queue.push([edge.vertices[0], (bipartInd+1)%2])
                    }
                }
            }
        }
        return bipartition;
    }

    properColoring() {
        const indSets = [];
        let availableVertices = [...this.vertices];
        let maxL, maxI, l, isIndependent, b;
        while (availableVertices.length > 0) {
            maxL = 0;
            for (let i = 0; i < 2**availableVertices.length; i++) {
                isIndependent = true;
                for (const edge of this.edges) {
                    if ((i & (1 << availableVertices.indexOf(edge.vertices[0]))) !== 0 && (i & (1 << availableVertices.indexOf(edge.vertices[1]))) !== 0) {
                        isIndependent = false;
                        break;
                    }
                }
                if (isIndependent) {
                    b = 1;
                    l = 0;
                    while (b <= i) {
                        if (b & i) l++;
                        b <<= 1;
                    }
                    if (l > maxL) {
                        maxL = l;
                        maxI = i;
                    }
                }
            }
            indSets.push(availableVertices.filter((v, ind) => (maxI & (1 << ind)) !== 0));
            availableVertices = availableVertices.filter((v, ind) => (maxI & (1 << ind)) === 0);
        }
        return indSets;
    }

    render(canv: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        ctx.shadowColor = "transparent";
        ctx.font = '20px arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        this.edges.forEach((e:Edge) => {e.render(canv, ctx)});
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20;
        this.vertices.slice().reverse().forEach((v:Vertex) => {v.render(canv, ctx)});
    }
}
