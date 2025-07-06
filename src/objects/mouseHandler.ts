export class MouseHandler {
    public target: any; memoryCoords: { x: number; y: number };
    constructor() {
        this.target = null;
        this.memoryCoords = {x: null, y: null};
    }

    setTarget(target: any) {
        this.target = target;
    }

    removeTarget() {
        this.target = null;
    }

    updateTargetCoords(coords: any) {
        if (this.target !== null) {
            this.target.x = coords.x;
            this.target.y = coords.y;
        }
    }
}