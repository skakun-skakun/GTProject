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
    document.getElementById("bfs"),
    document.getElementById("dfs"),
]

enum editModes {
    MoveVertex = 0,
    CreateVertex = 1,
    CreateEdge = 2,
    RemoveVertex = 3,
    RemoveEdge = 4,
    BFS =  5,
    DFS = 6,
}

const mouseHandler = new MouseHandler();

const resetMode = function() {
    for (const button of buttons) {
        button.classList.remove("bg-blue-300!");
    }
}

let mode = editModes.MoveVertex;

// const vertices = [...Array(9).keys()].map((i) => new Vertex('V'+i));
// const edges = [
//     new Edge(vertices[0], vertices[1]),
//     new Edge(vertices[0], vertices[3]),
//     new Edge(vertices[0], vertices[5]),
//     new Edge(vertices[0], vertices[7]),
//     new Edge(vertices[1], vertices[2]),
//     new Edge(vertices[3], vertices[4]),
//     new Edge(vertices[5], vertices[6]),
//     new Edge(vertices[7], vertices[8]),
// ];

// const graph = new Graph(vertices, edges);
const graph = new Graph([], [])

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
        graph.vertices.push(new Vertex('v'+(graph.vertices.length+1), event.x*100/canvas.width, event.y*100/canvas.height));
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
                case editModes.BFS: {
                    const BFSPath = graph.BFS(v);
                    BFSPath.forEach((ver, ind) => {setTimeout(() => {ver.color = "#00ff00"; draw()}, ind*500)});
                    setTimeout(() => {BFSPath.forEach((v) => v.color = "#0857bf"); draw()}, BFSPath.length*500);
                    break;
                }
                case editModes.DFS: {
                    const DFSPath = graph.DFS(v);
                    DFSPath.forEach((ver, ind) => {setTimeout(() => {ver.color = "#00ff00"; draw()}, ind*500)});
                    setTimeout(() => {DFSPath.forEach((v) => v.color = "#0857bf"); draw()}, DFSPath.length*500);
                    break;
                }
                default:
                    break;
            }
            draw()
            break;
        }
    }
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

document.getElementById("connectedComponents").addEventListener("click", (event: MouseEvent) => {
    const comps = graph.connectedComponents()
    for (const componentId in comps) {
        for (const vertexId in comps[componentId]) {
            comps[componentId][vertexId].x = 40*(2*componentId+1)/(comps.length);
            if (comps[componentId].length > 1)
                comps[componentId][vertexId].x += Math.cos(Math.PI*2*vertexId/comps[componentId].length)*(40/comps.length-1);
            comps[componentId][vertexId].y = 50 + Math.sin(Math.PI*2*vertexId/comps[componentId].length)*(40/comps.length-1);
        }
    }
    draw();
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

console.log(graph.connectedComponents())
draw();
// setTimeout(() => {
//     console.log(graph.vertices);
//     const DFSPath = graph.BFS(graph.vertices[Math.floor(Math.random()*graph.vertices.length)]);
//     DFSPath.forEach((ver, ind) => {setTimeout(() => {ver.color = "#ff0000"; draw(); console.log("Ebal " + ver.name)}, ind*1000);});
//     setTimeout(() => {DFSPath.forEach((v) => v.color = "#0857bf"); draw()}, DFSPath.length*1000);
// }, 10000);

// setInterval(draw, 10);
