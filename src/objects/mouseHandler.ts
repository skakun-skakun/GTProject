export class MouseHandler {
    public target: any;
    constructor() {
        this.target = null;
    }

    setTarget(target: any) {
        this.target = target;
    }

    removeTarget() {
        this.target = null;
    }

    updateTargetCoords(coords: any, canv: HTMLCanvasElement) {
        if (this.target !== null) {
            this.target.x = coords.x * 100 / canv.width;
            this.target.y = coords.y * 100 / canv.height;
        }
    }
}