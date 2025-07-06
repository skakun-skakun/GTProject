import * as TWEEN from "@tweenjs/tween.js";


export class Vertex {
    public x: number;
    public y: number;
    public radius: number;
    public name: string;
    public color: string;
    constructor(name: string, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.name = name;
        this.color = "#0857bf";
    }

    doesIntersect(x: number, y: number): boolean {
        return Math.pow(x-this.x, 2) + Math.pow(y-this.y, 2) <= Math.pow(this.radius*1.5, 2);
    }

    animateMovement(newX, newY) {
        return (new TWEEN.Tween({x: this.x, y: this.y})
            .to({x: newX, y: newY}, 500)
            .onUpdate((coords) => {this.x = coords.x; this.y = coords.y}));
    }

    render(canv: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const grad=ctx.createRadialGradient(
            this.x, this.y, this.radius/2,
            this.x, this.y, this.radius);
        ctx.fillStyle = grad;
        grad.addColorStop(0,"lightblue");
        grad.addColorStop(1,this.color);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#000000"
        ctx.fillText(this.name, this.x, this.y);
    }
}