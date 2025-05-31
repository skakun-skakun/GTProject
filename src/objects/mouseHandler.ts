export class MouseHandler {
    public target1: any;
    constructor() {
        this.target1 = null;
    }

    setTarget1(target: any) {
        this.target1 = target;
    }

    removeTarget1() {
        this.target1 = null;
    }

    updateTarget1Coords(coords: any, canv: HTMLCanvasElement) {
        if (this.target1 !== null) {
            this.target1.x = coords.x * 100 / canv.width;
            this.target1.y = coords.y * 100 / canv.height;
        }
    }
}