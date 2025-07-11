import { Vertex } from "./vertex.ts"


export class Edge {
    public vertices: Vertex[];

    constructor(vertex1: Vertex, vertex2: Vertex) {
        this.vertices = [vertex1, vertex2];
    }

    render(canv: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        ctx.lineTo(this.vertices[1].x, this.vertices[1].y);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}