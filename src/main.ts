import './style.css';
import { Vertex } from './objects/vertex.ts';
import { Edge } from "./objects/edge.ts";
import { Graph } from "./objects/graph.ts";
import {MouseHandler} from "./objects/mouseHandler.ts";

const canvas: any = document.getElementById("mainCanvas");
let tweens = [], isAnimated=false;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
const buttons = [
    document.getElementById("addVertex"),
    document.getElementById("addEdge"),
    document.getElementById("removeVertex"),
    document.getElementById("removeEdge"),
    document.getElementById("bfs"),
    document.getElementById("dfs"),
    document.getElementById("perAndEcc"),
]

enum editModes {
    Move = 0,
    CreateVertex = 1,
    CreateEdge = 2,
    RemoveVertex = 3,
    RemoveEdge = 4,
    BFS =  5,
    DFS = 6,
    PerAndEcc = 7
}

const mouseHandler = new MouseHandler();

const resetMode = function() {
    for (const button of buttons) {
        button.classList.remove("bg-blue-300!");
    }
}

let mode = editModes.Move;

const graph = new Graph([], [])

const draw = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graph.render(canvas, ctx);
}


const mobileCheck = () => /android|ipad|iphone|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent || navigator.vendor || window.opera);


for (const buttonId in buttons) {
    buttons[buttonId].addEventListener("click", () => {
        if (mouseHandler.target !== null) {
            mouseHandler.target.color = "#0857bf";
            mouseHandler.target.secondColor = "lightblue";
            mouseHandler.removeTarget();
        }
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

function onMouseDown(event) {
    if (isAnimated) return;
    if (mobileCheck()) event.preventDefault();
    if (mode === editModes.CreateVertex && (event.x == undefined || !mobileCheck())) {
        if (event.x == undefined)
            graph.vertices.unshift(new Vertex(graph.possibleVertexName(), event.touches[0].clientX, event.touches[0].clientY));
        else if (!mobileCheck())
            graph.vertices.unshift(new Vertex(graph.possibleVertexName(), event.x, event.y));
        draw();
        return;
    }
    for (const v of graph.vertices) {
        if ((event.x != undefined && !mobileCheck() && v.doesIntersect(event.x, event.y)) ||
            (event.x == undefined && v.doesIntersect(event.touches[0].clientX, event.touches[0].clientY))) {
            console.log(event)
            switch (mode) {
                case editModes.Move:
                    mouseHandler.setTarget(v);
                    break;
                case editModes.CreateEdge: {
                    if (mouseHandler.target !== null) {
                        if (v !== mouseHandler.target && !graph.edges.map((e) => {e.vertices.includes(v) && e.vertices.includes(mouseHandler.target)}).includes(true)) {
                            graph.edges.push(new Edge(mouseHandler.target, v));
                            graph.vertices.forEach(v => {v.color="#0857bf"})
                            // addEdge?.classList.toggle("bg-blue-300!");
                            // mode = editModes.Move;
                        }
                        mouseHandler.target.color = "#0857bf";
                        mouseHandler.target.secondColor = "lightblue";
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
                        mouseHandler.target.secondColor = "lightblue";
                        mouseHandler.removeTarget();
                    } else {
                        mouseHandler.setTarget(v);
                        v.color = "#ff0000";
                    }
                    break;
                }
                case editModes.BFS: {
                    const BFSPath = graph.BFS(v);
                    isAnimated = true;
                    BFSPath.forEach((ver, ind) => {setTimeout(() => {ver.color = "#00ff00"; draw()}, ind*500)});
                    setTimeout(() => {BFSPath.forEach((v) => v.color = "#0857bf"); draw(); isAnimated = false;}, BFSPath.length*500);
                    break;
                }
                case editModes.DFS: {
                    const DFSPath = graph.DFS(v);
                    isAnimated = true;
                    DFSPath.forEach((ver, ind) => {setTimeout(() => {ver.color = "#00ff00"; draw()}, ind*500)});
                    setTimeout(() => {DFSPath.forEach((v) => v.color = "#0857bf"); draw(); isAnimated = false;}, DFSPath.length*500);
                    break;
                }
                case editModes.PerAndEcc: {
                    const comp = graph.BFS(v);
                    let broken = false, dontTouchThisComponent = false;
                    for (const v of comp) {
                        if (v.color == "#00ff00") {
                            dontTouchThisComponent = true;
                            break;
                        } else if (v.color != "#0857bf") {
                            broken = true;
                            break;
                        }
                    }
                    if (broken) {
                        comp.forEach(v => {v.color = "#0857bf"; v.secondColor = "lightblue";})
                    } else if (!dontTouchThisComponent) {
                        const periphery = graph.periphery(comp), center = graph.center(comp);
                        for (const v of periphery) {
                            v.color = "#b714ff"
                        }
                        for (const v of center) {
                            v.secondColor = "#dc6a2c"
                        }
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
    if (mode === editModes.Move && mouseHandler.target === null) mouseHandler.target = true;
}


function onMouseUp() {
    if (mode === editModes.Move) {
        mouseHandler.removeTarget();
        mouseHandler.memoryCoords.x = null;
        mouseHandler.memoryCoords.y = null;
    }
}


function onMouseMove(event) {
    if (mobileCheck()) event.preventDefault();
    if (mode === editModes.Move && !isAnimated) {
        if (mouseHandler.target !== null) {
            if (mouseHandler.target == true) {
                if (mouseHandler.memoryCoords.x != null) {
                    for (const v of graph.vertices) {
                        if (event.x != undefined) {
                            v.x += event.x - mouseHandler.memoryCoords.x;
                            v.y += event.y - mouseHandler.memoryCoords.y
                        } else {
                            v.x += event.touches[0].clientX - mouseHandler.memoryCoords.x;
                            v.y += event.touches[0].clientY - mouseHandler.memoryCoords.y
                        }
                    }
                }
                if (event.x != undefined) {
                    mouseHandler.memoryCoords.x = event.x;
                    mouseHandler.memoryCoords.y = event.y;
                } else {
                    mouseHandler.memoryCoords.x = event.touches[0].clientX;
                    mouseHandler.memoryCoords.y = event.touches[0].clientY;
                }
            } else if (event.x != undefined) mouseHandler.updateTargetCoords({x: event.x, y: event.y})
            else mouseHandler.updateTargetCoords({x: event.touches[0].clientX, y: event.touches[0].clientY});
        }
        // draw();
    }
}


canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("touchstart", onMouseDown);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("touchend", onMouseUp);
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("touchmove", onMouseMove);

document.getElementById("connectedComponents").addEventListener("click", () => {
    if (isAnimated) return;
    const comps = graph.connectedComponents()
    for (const componentId in comps) {
        for (const vertexId in comps[componentId]) {
            const tween = comps[componentId][vertexId].animateMovement((40*(2*componentId+1)/(comps.length)+(Math.cos(Math.PI*2*vertexId/comps[componentId].length)*(comps[componentId].length > 1))*(40/comps.length-1))*canvas.width/100,
                (50 + Math.sin(Math.PI*2*vertexId/comps[componentId].length)*(30/comps.length-1))*canvas.height/100)
                .onStart(() => {isAnimated = true;})
                .onComplete(() => {tweens = tweens.filter((tw) => tw !== tween); isAnimated = false;});
            tweens.push(tween);
            tween.start();
        }
    }
    draw();
})

document.getElementById("bipartition").addEventListener("click", () => {
    if (isAnimated) return;
    const comps = graph.connectedComponents()
    for (const componentId in comps) {
        const bipart = graph.bipartition(comps[componentId]);
        if (bipart == -1) {
            for (const vertexId in comps[componentId]) {
                const tween = comps[componentId][vertexId].animateMovement((40*(2*componentId+1)/(comps.length)+(Math.cos(Math.PI*2*vertexId/comps[componentId].length)*(comps[componentId].length > 1))*(40/comps.length-1))*canvas.width/100,
                    (50 + Math.sin(Math.PI*2*vertexId/comps[componentId].length)*(30/comps.length-1))*canvas.height/100)
                    .onStart(() => {isAnimated = true;})
                    .onComplete(() => {tweens = tweens.filter((tw) => tw !== tween); isAnimated = false;});
                tweens.push(tween);
                tween.start();
            }
        } else {
            for (const vertexId in bipart[0]) {
                const tween = bipart[0][vertexId].animateMovement((40 * (2 * componentId + 1) / (comps.length)-(40/comps.length-1)) * canvas.width / 100,
                    (50 + 40*(vertexId*1+1-(bipart[0].length+1)/2)/(bipart[0].length-0.9999)) * canvas.height / 100)
                    .onStart(() => {
                        isAnimated = true;
                    })
                    .onComplete(() => {
                        tweens = tweens.filter((tw) => tw !== tween);
                        isAnimated = false;
                    });
                tweens.push(tween);
                tween.start();
            }
            for (const vertexId in bipart[1]) {
                const tween = bipart[1][vertexId].animateMovement((40 * (2 * componentId + 1) / (comps.length) + (40/comps.length-1)) * canvas.width / 100,
                    (50 + 40*(vertexId*1+1-(bipart[1].length+1)/2)/(bipart[1].length-0.9999)) * canvas.height / 100)
                    .onStart(() => {
                        isAnimated = true;
                    })
                    .onComplete(() => {
                        tweens = tweens.filter((tw) => tw !== tween);
                        isAnimated = false;
                    });
                tweens.push(tween);
                tween.start();
            }
        }
    }
    draw();
})

document.getElementById("coloring").addEventListener("click", () => {
    if (isAnimated) return;
    let resetColor = false;
    graph.vertices.forEach(v => {
        if (resetColor || v.color.includes('hsl')) {
            resetColor = true;
            v.color = "#0857bf";
            v.secondColor = "lightblue";
        }
    })
    if (!resetColor) {
        const propColor = graph.properColoring();
        for (const colorId in propColor) {
            for (const vertexId in propColor[colorId]) {
                propColor[colorId][vertexId].color = `hsl(${300 * colorId / (propColor.length-0.999)}, 100%, 50%)`;
                propColor[colorId][vertexId].secondColor = 'lightblue';
            }
        }
    }
})

// console.log(graph.adjacencyMatrix());
// console.log(graph.incidenceMatrix());

const resize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}

const animate = (t) => {
    for (const tw of tweens) {
        tw.update(t);
    }
    draw();
    window.requestAnimationFrame(animate);
}


resize();
window.addEventListener('resize', resize);
animate();