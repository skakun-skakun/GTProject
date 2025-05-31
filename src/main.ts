import './style.css';
// import { Tween } from "@tweenjs/tween.js";
import { Vertex } from './objects/vertex.ts';
import { Edge } from "./objects/edge.ts";
import { Graph } from "./objects/graph.ts";
import {MouseHandler} from "./objects/mouseHandler.ts";

const canvas: any = document.getElementById("mainCanvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
const addVertex: HTMLElement = document.getElementById("addVertex");
const addEdge: HTMLElement = document.getElementById("addEdge");
const mouseHandler = new MouseHandler();

enum editModes {
    MoveVertex = 0,
    ChooseVertex = 1
}

let mode = editModes.MoveVertex;

const graph = new Graph([], []);

const draw = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graph.render(canvas, ctx);
}

addVertex.addEventListener("click", () => {
    // const v = graph.vertices[Math.floor(Math.random() * graph.vertices.length)];
    graph.vertices.push(new Vertex('new'));
    // graph.edges.push(new Edge(v, vertices[vertices.length - 1]));
    draw();
})

addEdge.addEventListener("click", () => {
    if (mode === editModes.ChooseVertex) {
        addEdge.classList.toggle("bg-blue-300!")
        mode = editModes.MoveVertex
        if (mouseHandler.target1 !== null)
            mouseHandler.target1.color = "#0857bf";
    }
    else {
        addEdge.classList.toggle("bg-blue-300!")
        mode = editModes.ChooseVertex
    }
    mouseHandler.removeTarget1();
    draw();
})



canvas.addEventListener("mousedown", (event: MouseEvent) => {
    if (mode === editModes.MoveVertex) {
        for (const v of graph.vertices) {
            if (v.doesIntersect(canvas, event.x, event.y)) {
                mouseHandler.setTarget1(v);
                break;
            }
        }
    } else if (mode === editModes.ChooseVertex) {
        // let broke = false;
        for (const v of graph.vertices) {
            if (v.doesIntersect(canvas, event.x, event.y)) {
                if (mouseHandler.target1 !== null) {
                    if (v === mouseHandler.target1) {
                        v.color = "#0857bf";
                        mouseHandler.removeTarget1();
                    } else if (! graph.edges.map((e) => {return e.vertices.includes(v) && e.vertices.includes(mouseHandler.target1)}).includes(true)) {
                        graph.edges.push(new Edge(mouseHandler.target1, v));
                        v.color = "#0857bf";
                        // addEdge?.classList.toggle("bg-blue-300!");
                        // mode = editModes.MoveVertex;
                    }
                    mouseHandler.target1.color = "#0857bf";
                    mouseHandler.removeTarget1();
                } else {
                    mouseHandler.setTarget1(v);
                        v.color = "#ffee6e";
                }
                draw();
                // broke = true;
                break;
            }
        }
        // if (!broke && mouseHandler.target1 !== null) {
        //     graph.vertices.push(new Vertex('new', event.x*100/canvas.width, event.y*100/canvas.height));
        //     graph.edges.push(new Edge(graph.vertices[graph.vertices.length-1], mouseHandler.target1));
        //     mouseHandler.target1.color = "#0857bf";
        //     mouseHandler.removeTarget1();
        //     mode = editModes.MoveVertex;
        //     addEdge?.classList.toggle("bg-blue-300!")
        //     draw();
        // }
    }
})

canvas.addEventListener("mouseup", () => {
    if (mode === editModes.MoveVertex)
        mouseHandler.removeTarget1()
})

canvas.addEventListener("mousemove", (event: MouseEvent) => {
    if (mode === editModes.MoveVertex) {
        mouseHandler.updateTarget1Coords({x: event.x, y: event.y}, canvas)
        draw();
    }
})

// console.log(graph);
// console.log(graph.adjacencyMatrix());
// console.log(graph.incidenceMatrix());


const resize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}

resize();
window.addEventListener('resize', resize);

draw();
// setInterval(draw, 10);