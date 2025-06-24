export class Vertex {
    public x: number;
    public y: number;
    public radius: number;
    public name: string;
    public color: string;
    constructor(name: string, x: number = -1, y: number = -1) {
        if (x === -1)
            this.x = Math.floor(    Math.random() * 70)+5;
        else
            this.x = x;
        if (y === -1)
            this.y = Math.floor(Math.random() * 90)+5;
        else
            this.y = y;
        this.radius = 10;
        this.name = name;
        this.color = "#0857bf";
    }

    absoluteX (canvas: HTMLCanvasElement) {
        return this.x*canvas.width/100;
    }

    absoluteY (canvas: HTMLCanvasElement) {
        return this.y*canvas.height/100;
    }

    doesIntersect(canv: HTMLCanvasElement, x: number, y: number): boolean {
        return Math.pow(x-this.absoluteX(canv), 2) + Math.pow(y-this.absoluteY(canv), 2) <= Math.pow(this.radius*2.5, 2);
    }

    render(canv: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const grad=ctx.createRadialGradient(
            this.absoluteX(canv), this.absoluteY(canv), this.radius/2,
            this.absoluteX(canv), this.absoluteY(canv), this.radius);
        ctx.fillStyle = grad;
        grad.addColorStop(0,"lightblue");
        grad.addColorStop(1,this.color);
        ctx.beginPath();
        ctx.arc(this.absoluteX(canv), this.absoluteY(canv), this.radius, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#000000"
        ctx.fillText(this.name, this.absoluteX(canv), this.absoluteY(canv));
    }
}