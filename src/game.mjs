import { updateWith } from "lodash";
import { engine } from "./engine.mjs";
import { drawImage } from "./utils.mjs";
import { Engine, Render, Runner, Bodies, Composite, Common, Mouse, MouseConstraint, Composites, Body, World } from 'matter-js';

// create two boxes and a ground
let boxA;
let boxB;
let ground;

// create an engine
let matter_engine;

// create a renderer
let render;
let sb1;
let rectangle1, rectangle2, rectangle3;
function initMatterJs() {
    // create an engine
    matter_engine = Engine.create();

    // create a renderer
    render = Render.create({
        element: document.body,
        engine: matter_engine,
        options: {
            background: 'transparent',
            wireframes: false,
            width: 800,
            height: 600,
        }
    });

    render.canvas.id = "matter-canvas";
    // add all of the bodies to the world

    rectangle1 = Bodies.rectangle(200, 500, 200, 50, { restitution: 0.7 });
    rectangle2 = Bodies.rectangle(400, 400, 150, 100, { restitution: 0.7 });
    rectangle3 = Bodies.rectangle(600, 200, 200, 50, { restitution: 0.7 });

// Add the rectangles to the world
    World.add(matter_engine.world, [rectangle1, rectangle2, rectangle3]);



    var particleOptions = {
        friction: 0.05,
        frictionStatic: 0.5,
        render: { visible: true, wireframes: false },
    };

    sb1 = soft_body(250, 100, 12, 12, 0, 0, true, 8, particleOptions);
    Composite.add(matter_engine.world, [
        // see softBody function defined later in this file
        sb1,
        // walls
        Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
        Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
        Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
        Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: true 
                }
            }
        });

    Composite.add(matter_engine.world, mouseConstraint);
    Composite.add(sb1, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // Overlay two canvases on top of each other
    // Get references to the canvases
    const engineCanvas = document.getElementById('engine-canvas');
    const matterCanvas = document.getElementById('matter-canvas');

    // Set the styles for the first canvas (to hide and not take space)
    engineCanvas.style.position = 'absolute';
    engineCanvas.style.top = '0';
    engineCanvas.style.left = '0';
    engineCanvas.style.pointerEvents = 'none'; // Make it non-interactive

    // Set the styles for the second canvas (to overlay on top)
    matterCanvas.style.position = 'absolute';
    matterCanvas.style.top = '0';
    matterCanvas.style.left = '0';
    matterCanvas.style.pointerEvents = 'none'; // Make it non-interactive
    matterCanvas.style.zIndex = '1'; // Ensure it overlays the first canvas

    // run the renderer
    Render.run(render);

}
function initGame() {
    initMatterJs();
    let x = canvas.width / 2, y = canvas.height / 2;
    // Set custom update function
    let t = 0;
    let arr = [backMountain, backWaves, backTrees, backSunset, backSun];
    let arrIndex = 0;
    engine.update = (() => {
        t += 0.1;
        arrIndex += 0.005;
        x += (engine.mouseX - x) / 100;
        y += (engine.mouseY - y) / 100;

        const dx = engine.mouseX - canvas.width/2;
        const dy = engine.mouseY - canvas.height/2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Set the gravity based on the mouse direction and magnitude
        const gravityX = (dx / distance);
        const gravityY = (dy / distance);

        // Set the engine's gravity
        matter_engine.world.gravity.x = gravityX;
        matter_engine.world.gravity.y = gravityY;


        Engine.update(matter_engine, 5);
        Engine.update(matter_engine, 5);
        Engine.update(matter_engine, 5);


    });
    // Set custom draw function
    engine.draw = (() => {
        let i = Math.floor(arrIndex % arr.length);
        let j = (i + 1) % arr.length;

        let alphai = j - arrIndex;
        let alphaj = arrIndex - i;

        context.globalAlpha = 1;
        drawImage(arr[i], 0, 0, canvas.width, canvas.height);

        context.globalAlpha = alphaj;
        drawImage(arr[j], 0, 0, canvas.width, canvas.height);

        context.globalAlpha = 1;
        drawImage(femaleAction, x, y, 60, 80);
    });
    
    engine.onmouseup = () => {
        for (const body of sb1.bodies) {
            let x_ = body.position.x;
            let y_ = body.position.y;
            Body.applyForce(body, body.position, { x: -(x_ - engine.mouseX) / 10000, y: -(y_ - engine.mouseY) / 10000 });
            Body.setAngularVelocity(body, 0.01);
        }
        let getRandomForce = () => {
            return {
                x: 2 * (Math.random() - 0.8),
                y: 2 * (Math.random() - 0.8)
            }
        }
        Body.applyForce(rectangle1, rectangle1.position, getRandomForce())
        Body.setAngularSpeed(rectangle1, 0.2);
        Body.applyForce(rectangle2, rectangle1.position, getRandomForce())
        Body.setAngularSpeed(rectangle2, 0.2);
        Body.applyForce(rectangle3, rectangle1.position, getRandomForce())
        Body.setAngularSpeed(rectangle3, 0.2);
    }
}
function soft_body(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {

    particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
    constraintOptions = Common.extend({ stiffness: 0.9, render: { type: 'line', anchors: false} }, constraintOptions);

    var softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
        return Bodies.circle(x, y, particleRadius, particleOptions);
    });

    Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);

    softBody.label = 'Soft Body';

    return softBody;
};

if (typeof module !== 'undefined') {
    module.exports = Example.softBody;
}
let game = {
    init: initGame
}
export { game }