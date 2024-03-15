let engine = {
    update: () => {console.log("No update function is set in game engine."); engine.isCustomUpdate = false},
    draw: default_draw,
    onkeyup: keyCode => {console.log("Default keyup. keycode:", keyCode)},
    onkeydown: keyCode => {console.log("Default keydown. keycode:", keyCode)},
    oninit: () => {console.log("Default oninit.")},
    onmouseup: () => {console.log("Mouseup: ", engine.mouseX, engine.mouseY)},
    onmousedown: () => {console.log("Mousedown: ", engine.mouseX, engine.mouseY)},
    onmousemove: () => {},
    context: null,
    canvas: null,
    init: initEngine,
    updateTime : 10,
    mouseX : 0,
    mouseY : 0,
    isKeyPressed : new Array(256).fill(0),
    endlessCanvas: false
};

const reqAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    setTimeout(callback, 1000 / 30);
};


function updateMousePosition(e) {
    let boundingRect = engine.canvas.getBoundingClientRect();
    engine.mouseX = e.pageX - boundingRect.x;
    engine.mouseY = e.pageY - boundingRect.y;
}

function updateMousePositionTouchEvent(e) {
    let boundingRect = engine.canvas.getBoundingClientRect();
    let touchobj = e.changedTouches[0];
    engine.mouseX = touchobj.pageX - boundingRect.x;
    engine.mouseY = touchobj.pageY - boundingRect.y;
}

function initCanvas() {
    // Get engine.canvas element
    let canvasElement = document.createElement('canvas');
    canvasElement.id = "engine-canvas";
    document.body.appendChild(canvasElement);

    engine.canvas = canvasElement;

    if (engine.endlessCanvas) {
        engine.canvas.width = window.innerWidth;
        engine.canvas.height = window.innerHeight;

        // Change engine.canvas.width and .height on browser resize
        window.onresize = function () {
            engine.canvas.width = window.innerWidth;
            engine.canvas.height = window.innerHeight;
        };
    } else {
        // Default engine.canvas size
        engine.canvas.width = 800;
        engine.canvas.height = 600;
    }

    // Get 2d engine.context
    engine.context = engine.canvas.getContext("2d");
    engine.context.fillStyle = "#0000ff";
}

function initEvents() {
    // Events for touchscreen devices
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        window.addEventListener("touchstart", function (e) {
            // Update global mouseX, mouseY variables
            updateMousePositionTouchEvent(e);
                engine.onmousedown();
        });
        window.addEventListener("touchend", function (e) {
            updateMousePositionTouchEvent(e);
                engine.onmouseup();
        });
        window.addEventListener("touchmove", function (e) {
            updateMousePositionTouchEvent(e);
        });
    }

    // Update global mouseX, mouseY variables
    window.addEventListener("mousemove", updateMousePosition);

    // Call mousemove, mouseup, mousedown function from game.js if they exist
    window.addEventListener("mousemove", () => {engine.onmousemove()});
    window.addEventListener("mouseup", () => {engine.onmouseup()});
    window.addEventListener("mousedown", () => {engine.onmousedown()});

    // Update global isKeyPressed array
    window.addEventListener("keydown", function (e) {
        engine.isKeyPressed[e.keyCode] = 1;
        engine.onkeydown(e.keyCode);
    });
    window.addEventListener("keyup", function (e) {
        engine.isKeyPressed[e.keyCode] = 0;
        engine.onkeyup(e.keyCode);
    });
}
// Redraw will be executed many times
function redraw() {
    engine.context.clearRect(0, 0, engine.canvas.width, engine.canvas.height);
    engine.context.save();

    // Call draw function from game.js
    engine.draw();

    engine.context.restore();
    // Call redraw after some time (the browser decides this time)
    reqAnimationFrame(redraw);
};

function default_draw() {
    engine.context.clearRect(0, 0, engine.canvas.width, engine.canvas.height);
    engine.context.globalAlpha = 1;
    engine.context.fillStyle = "#FF0000";
    engine.context.font = "20px Arial";

    engine.context.fillText("No draw function set. (calling default engine.draw function).", 40, 40);

    if(!engine.isCustomUpdate) {
        engine.isCustomUpdate = true;
        engine.context.fillText("No update function set. (calling default engine.update function).", 40, 80);
    }
}
// Init game engine
function initEngine() {
    initCanvas();

    // Attach basic mouse and keyboard events
    initEvents();

    // Attach common objects to global scope
    window.engine = engine;
    window.context = engine.context;
    window.canvas = engine.canvas;

    // Start draw loop
    redraw();
    // Start update loop
    setInterval(() => {engine.update()}, engine.updateTime);
}


export {engine};