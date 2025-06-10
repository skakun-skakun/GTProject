export class Vertex {
    public x: number;
    public y: number;
    public radius: number;
    public name: string;
    public color: string;
    constructor(name: string, x: number = -1, y: number = -1) {
        this.x = x;
        this.y = y;
        if (x === -1)
            this.x = Math.floor(    Math.random() * 70)+5;
        if (y === -1)
            this.y = Math.floor(Math.random() * 90)+5;
        this.radius = 10;
        this.name = name;
        this.color = "#0857bf";
    }

    relativeX (canvas: HTMLCanvasElement) {
        return this.x*canvas.width/100;
    }

    relativeY (canvas: HTMLCanvasElement) {
        return this.y*canvas.height/100;
    }

    doesIntersect(canv: HTMLCanvasElement, x: number, y: number): boolean {
        return Math.pow(x-this.relativeX(canv), 2) + Math.pow(y-this.relativeY(canv), 2) <= Math.pow(this.radius*2, 2);
    }

    render(canv: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const grad=ctx.createRadialGradient(
            this.relativeX(canv), this.relativeY(canv), this.radius/2,
            this.relativeX(canv), this.relativeY(canv), this.radius);
        ctx.fillStyle = grad;
        grad.addColorStop(0,"lightblue");
        grad.addColorStop(1,this.color);
        ctx.beginPath();
        ctx.arc(this.relativeX(canv), this.relativeY(canv), this.radius, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
}