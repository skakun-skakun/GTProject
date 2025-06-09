import './style.css';
// import { Tween } from "@tweenjs/tween.js";
import { Vertex } from './objects/vertex.ts';
import { Edge } from "./objects/edge.ts";
import { Graph } from "./objects/graph.ts";
import {MouseHandler} from "./objects/mouseHandler.ts";

const canvas: any = document.getElementById("mainCanvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
const buttons = [
    document.getElementById("addVertex"),
    document.getElementById("addEdge"),
    document.getElementById("removeVertex"),
    document.getElementById("removeEdge"),
]

enum editModes {
    MoveVertex = 0,
    CreateVertex = 1,
    CreateEdge = 2,
    RemoveVertex = 3,
    RemoveEdge = 4
}

const mouseHandler = new MouseHandler();

const resetMode = function() {
    for (const button of buttons) {
        button.classList.remove("bg-blue-300!");
    }
}

let mode = editModes.MoveVertex;

const graph = new Graph([], []);

const draw = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graph.render(canvas, ctx);
}

for (const buttonId in buttons) {
    buttons[buttonId].addEventListener("click", () => {
        if (mouseHandler.target !== null)
            mouseHandler.target.color = "#0857bf";
            mouseHandler.removeTarget();
        if (buttons[buttonId].classList.contains("bg-blue-300!")) {
            buttons[buttonId].classList.remove("bg-blue-300!");
            mode = 0;
        } else {
            resetMode();
            buttons[buttonId].classList.add("bg-blue-300!");
            mode = buttonId*1 + 1;
        }
        draw()
    });
}

canvas.addEventListener("mousedown", (event: MouseEvent) => {
    if (mode === editModes.CreateVertex) {
        graph.vertices.push(new Vertex('new', event.x*100/canvas.width, event.y*100/canvas.height));
        draw();
        return;
    }
    for (const v of graph.vertices) {
        if (v.doesIntersect(canvas, event.x, event.y)) {
            switch (mode) {
                case editModes.MoveVertex:
                    mouseHandler.setTarget(v);
                    break;
                case editModes.CreateEdge: {
                    if (mouseHandler.target !== null) {
                        if (v !== mouseHandler.target && !graph.edges.map((e) => {e.vertices.includes(v) && e.vertices.includes(mouseHandler.target)}).includes(true)) {
                            graph.edges.push(new Edge(mouseHandler.target, v));
                            // addEdge?.classList.toggle("bg-blue-300!");
                            // mode = editModes.MoveVertex;
                        }
                        mouseHandler.target.color = "#0857bf";
                        mouseHandler.removeTarget();
                    } else {
                        mouseHandler.setTarget(v);
                        v.color = "#ffee6e";
                    }
                    break;
                }
                case editModes.RemoveVertex: {
                    graph.edges = graph.edges.filter(edge => !edge.vertices.includes(v));
                    graph.vertices = graph.vertices.filter(vertex => vertex !== v);
                    draw();
                    break;
                }
                case editModes.RemoveEdge: {
                    if (mouseHandler.target !== null) {
                        if (v !== mouseHandler.target) {
                            graph.edges = graph.edges.filter(edge => !edge.vertices.includes(v) || !edge.vertices.includes(mouseHandler.target));
                        }
                        mouseHandler.target.color = "#0857bf";
                        mouseHandler.removeTarget();
                    } else {
                        mouseHandler.setTarget(v);
                        v.color = "#ff0000";
                    }
                    break;
                }
                default:
                    break;
            }
            draw()
            break;
        }
    }
    // if (mode === editModes.MoveVertex) {
    //     for (const v of graph.vertices) {
    //         if (v.doesIntersect(canvas, event.x, event.y)) {
    //             mouseHandler.settarget(v);
    //             break;
    //         }
    //     }
    // } else if (mode === editModes.CreateVertex) {
    //     // let broke = false;
    //     for (const v of graph.vertices) {
    //         if (v.doesIntersect(canvas, event.x, event.y)) {
    //             if (mouseHandler.target !== null) {
    //                 if (v === mouseHandler.target) {
    //                     v.color = "#0857bf";
    //                     mouseHandler.removetarget();
    //                 } else if (! graph.edges.map((e) => {return e.vertices.includes(v) && e.vertices.includes(mouseHandler.target)}).includes(true)) {
    //                     graph.edges.push(new Edge(mouseHandler.target, v));
    //                     v.color = "#0857bf";
    //                     // addEdge?.classList.toggle("bg-blue-300!");
    //                     // mode = editModes.MoveVertex;
    //                 }
    //                 mouseHandler.target.color = "#0857bf";
    //                 mouseHandler.removetarget();
    //             } else {
    //                 mouseHandler.settarget(v);
    //                     v.color = "#ffee6e";
    //             }
    //             draw();
    //             // broke = true;
    //             break;
    //         }
    //     }
        // if (!broke && mouseHandler.target !== null) {
        //     graph.vertices.push(new Vertex('new', event.x*100/canvas.width, event.y*100/canvas.height));
        //     graph.edges.push(new Edge(graph.vertices[graph.vertices.length-1], mouseHandler.target));
        //     mouseHandler.target.color = "#0857bf";
        //     mouseHandler.removetarget();
        //     mode = editModes.MoveVertex;
        //     addEdge?.classList.toggle("bg-blue-300!")
        //     draw();
        // }
    // }
})

canvas.addEventListener("mouseup", () => {
    if (mode === editModes.MoveVertex)
        mouseHandler.removeTarget()
})

canvas.addEventListener("mousemove", (event: MouseEvent) => {
    if (mode === editModes.MoveVertex) {
        mouseHandler.updateTargetCoords({x: event.x, y: event.y}, canvas)
        draw();
    }
})

console.log(graph.adjacencyMatrix());
console.log(graph.incidenceMatrix());


const resize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}

resize();
window.addEventListener('resize', resize);

draw();
// setInterval(draw, 10);