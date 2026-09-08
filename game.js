/*
===========================================================
BODY GAME
===========================================================

This file:

1. Loads MediaPipe Pose Landmarker
2. Requests camera access
3. Detects the player's body
4. Draws the skeleton
5. Uses the shoulders to control the player
6. Spawns targets
7. Detects target collisions
8. Keeps score
===========================================================
*/


/* =========================================================
   MEDIAPIPE IMPORT
========================================================= */

import {
    FilesetResolver,
    PoseLandmarker
} from
"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm";


/* =========================================================
   HTML ELEMENTS
========================================================= */

const video =
    document.getElementById("camera");

const skeletonCanvas =
    document.getElementById(
        "skeletonCanvas"
    );

const gameCanvas =
    document.getElementById(
        "gameCanvas"
    );

const skeletonCtx =
    skeletonCanvas.getContext("2d");

const gameCtx =
    gameCanvas.getContext("2d");


const startButton =
    document.getElementById(
        "startButton"
    );

const flipButton =
    document.getElementById(
        "flipButton"
    );

const pauseButton =
    document.getElementById(
        "pauseButton"
    );


const cameraMessage =
    document.getElementById(
        "cameraMessage"
    );


const trackingStatus =
    document.getElementById(
        "trackingStatus"
    );

const poseStatus =
    document.getElementById(
        "poseStatus"
    );

const scoreText =
    document.getElementById(
        "score"
    );

const fpsText =
    document.getElementById(
        "fps"
    );


/* =========================================================
   MEDIAPIPE SETTINGS
========================================================= */

const MODEL_URL =
"https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task";


const WASM_URL =
"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm";


/* =========================================================
   GAME STATE
========================================================= */

let poseLandmarker = null;

let stream = null;

let cameraRunning = false;

let paused = false;

let facingMode = "user";

let lastVideoTime = -1;

let latestPose = null;

let score = 0;

let targets = [];

let lastTargetSpawn = 0;

let lastFrameTime =
    performance.now();

let frameCounter = 0;


/* =========================================================
   BODY CONNECTIONS
========================================================= */

/*
    MediaPipe landmark numbers:

    11 = left shoulder
    12 = right shoulder

    13 = left elbow
    14 = right elbow

    15 = left wrist
    16 = right wrist

    23 = left hip
    24 = right hip

    25 = left knee
    26 = right knee

    27 = left ankle
    28 = right ankle
*/

const connections = [

    [11, 12],

    [11, 13],
    [13, 15],

    [12, 14],
    [14, 16],

    [11, 23],
    [12, 24],

    [23, 24],

    [23, 25],
    [25, 27],

    [24, 26],
    [26, 28]

];


/* =========================================================
   PLAYER
========================================================= */

const player = {

    x: 0.5,

    y: 0.82,

    radius: 35
};


/* =========================================================
   LOAD MEDIAPIPE
========================================================= */

async function initializePose() {

    trackingStatus.textContent =
        "Loading model...";


    try {

        const vision =
            await FilesetResolver.forVisionTasks(
                WASM_URL
            );


        poseLandmarker =
            await PoseLandmarker.createFromOptions(
                vision,
                {

                    baseOptions: {

                        modelAssetPath:
                            MODEL_URL,

                        delegate:
                            "GPU"
                    },


                    runningMode:
                        "VIDEO",


                    numPoses:
                        1,


                    minPoseDetectionConfidence:
                        0.5,


                    minPosePresenceConfidence:
                        0.5,


                    minTrackingConfidence:
                        0.5

                }
            );


        trackingStatus.textContent =
            "Model ready";


    } catch (error) {

        console.error(error);

        trackingStatus.textContent =
            "Model failed";


        alert(
            "The body-tracking model could not be loaded."
        );
    }
}


/* =========================================================
   START CAMERA
========================================================= */

async function startCamera() {

    /*
        Load MediaPipe first.
    */

    if (!poseLandmarker) {

        await initializePose();

        if (!poseLandmarker) {

            return;
        }
    }


    try {

        /*
            Stop an old camera stream.
        */

        if (stream) {

            stream
                .getTracks()
                .forEach(
                    track =>
                        track.stop()
                );
        }


        /*
            Ask the browser for camera access.
        */

        stream =
            await navigator
                .mediaDevices
                .getUserMedia({

                    video: {

                        facingMode:
                            facingMode,

                        width: {

                            ideal: 1280
                        },

                        height: {

                            ideal: 720
                        },

                        frameRate: {

                            ideal: 30,

                            max: 60
                        }
                    },

                    audio: false
                });


        video.srcObject =
            stream;


        await video.play();


        cameraRunning = true;

        paused = false;


        cameraMessage
            .classList
            .add("hidden");


        startButton.textContent =
            "CAMERA RUNNING";


        startButton.disabled =
            true;


        pauseButton.disabled =
            false;


        trackingStatus.textContent =
            "Camera running";


        resizeCanvases();


        requestAnimationFrame(
            mainLoop
        );


    } catch (error) {

        console.error(error);


        trackingStatus.textContent =
            "Camera blocked";


        alert(
            "Camera access was blocked. Allow camera access and try again."
        );
    }
}


/* =========================================================
   FLIP CAMERA
========================================================= */

async function flipCamera() {

    if (!cameraRunning) {

        return;
    }


    facingMode =
        facingMode === "user"
            ? "environment"
            : "user";


    await startCamera();
}


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

    paused =
        !paused;


    pauseButton.textContent =
        paused
            ? "RESUME"
            : "PAUSE";


    trackingStatus.textContent =
        paused
            ? "Paused"
            : "Camera running";
}


/* =========================================================
   CANVAS SIZE
========================================================= */

function resizeCanvases() {

    const width =
        video.videoWidth ||
        video.clientWidth;


    const height =
        video.videoHeight ||
        video.clientHeight;


    skeletonCanvas.width =
        width;

    skeletonCanvas.height =
        height;


    gameCanvas.width =
        width;

    gameCanvas.height =
        height;
}


/* =========================================================
   MAIN GAME LOOP
========================================================= */

async function mainLoop(time) {

    if (!cameraRunning) {

        return;
    }


    requestAnimationFrame(
        mainLoop
    );


    updateFPS(time);


    if (paused) {

        return;
    }


    if (
        video.readyState <
        HTMLMediaElement.HAVE_CURRENT_DATA
    ) {

        return;
    }


    resizeCanvases();


    /*
        Only process a new video frame.
    */

    if (
        video.currentTime !==
        lastVideoTime
    ) {

        lastVideoTime =
            video.currentTime;


        const result =
            poseLandmarker
                .detectForVideo(
                    video,
                    performance.now()
                );


        if (
            result &&
            result.landmarks &&
            result.landmarks.length > 0
        ) {

            latestPose =
                result.landmarks[0];


            poseStatus.textContent =
                "Detected";


        } else {

            latestPose =
                null;


            poseStatus.textContent =
                "Not detected";
        }
    }


    drawSkeleton();

    updateGame(time);

    drawGame();
}


/* =========================================================
   FPS
========================================================= */

function updateFPS(time) {

    frameCounter++;


    if (
        time -
        lastFrameTime >=
        1000
    ) {

        fpsText.textContent =
            `FPS: ${frameCounter}`;


        frameCounter = 0;

        lastFrameTime =
            time;
    }
}


/* =========================================================
   GET BODY LANDMARK
========================================================= */

function landmark(index) {

    if (!latestPose) {

        return null;
    }


    return latestPose[index];
}


/* =========================================================
   DRAW BODY SKELETON
========================================================= */

function drawSkeleton() {

    skeletonCtx.clearRect(
        0,
        0,
        skeletonCanvas.width,
        skeletonCanvas.height
    );


    if (!latestPose) {

        return;
    }


    const width =
        skeletonCanvas.width;

    const height =
        skeletonCanvas.height;


    /*
        Draw bones.
    */

    skeletonCtx.lineWidth = 7;

    skeletonCtx.lineCap =
        "round";

    skeletonCtx.strokeStyle =
        "#00ff9d";


    for (
        const [a, b]
        of connections
    ) {

        const p1 =
            latestPose[a];

        const p2 =
            latestPose[b];


        if (
            !p1 ||
            !p2 ||
            p1.visibility < 0.35 ||
            p2.visibility < 0.35
        ) {

            continue;
        }


        /*
            Mirror X because the camera
            is mirrored.
        */

        const x1 =
            (1 - p1.x) *
            width;

        const y1 =
            p1.y *
            height;


        const x2 =
            (1 - p2.x) *
            width;

        const y2 =
            p2.y *
            height;


        skeletonCtx.beginPath();

        skeletonCtx.moveTo(
            x1,
            y1
        );

        skeletonCtx.lineTo(
            x2,
            y2
        );

        skeletonCtx.stroke();
    }


    /*
        Draw joints.
    */

    for (
        const point
        of latestPose
    ) {

        if (
            !point ||
            point.visibility < 0.35
        ) {

            continue;
        }


        const x =
            (1 - point.x) *
            width;

        const y =
            point.y *
            height;


        skeletonCtx.beginPath();


        skeletonCtx.arc(
            x,
            y,
            7,
            0,
            Math.PI * 2
        );


        skeletonCtx.fillStyle =
            "#ffffff";


        skeletonCtx.fill();


        skeletonCtx.beginPath();


        skeletonCtx.arc(
            x,
            y,
            4,
            0,
            Math.PI * 2
        );


        skeletonCtx.fillStyle =
            "#00ff9d";


        skeletonCtx.fill();
    }
}


/* =========================================================
   UPDATE GAME
========================================================= */

function updateGame(time) {

    /*
        Get shoulders.
    */

    const leftShoulder =
        landmark(11);

    const rightShoulder =
        landmark(12);


    /*
        Use the middle of the shoulders
        to control the player.
    */

    if (
        leftShoulder &&
        rightShoulder
    ) {

        const centerX =
            (
                leftShoulder.x +
                rightShoulder.x
            ) / 2;


        /*
            Reverse X because the
            camera is mirrored.
        */

        const targetX =
            1 - centerX;


        /*
            Smooth movement.
        */

        player.x +=
            (
                targetX -
                player.x
            ) * 0.15;
    }


    /*
        Keep player on screen.
    */

    player.x =
        Math.max(
            0.05,
            Math.min(
                0.95,
                player.x
            )
        );


    /*
        Spawn targets.
    */

    if (
        time -
        lastTargetSpawn >
        900
    ) {

        spawnTarget();

        lastTargetSpawn =
            time;
    }


    /*
        Move targets.
    */

    for (
        let i =
            targets.length - 1;

        i >= 0;

        i--
    ) {

        const target =
            targets[i];


        target.y +=
            target.speed;


        /*
            Distance between player
            and target.
        */

        const dx =
            target.x -
            player.x;


        const dy =
            target.y -
            player.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        /*
            Collision.
        */

        if (
            distance < 0.07
        ) {

            score++;


            scoreText.textContent =
                score;


            targets.splice(
                i,
                1
            );


            continue;
        }


        /*
            Target left screen.
        */

        if (
            target.y > 1.1
        ) {

            targets.splice(
                i,
                1
            );
        }
    }
}


/* =========================================================
   CREATE TARGET
========================================================= */

function spawnTarget() {

    targets.push({

        x:
            0.1 +
            Math.random() *
            0.8,

        y:
            -0.1,

        speed:
            0.0025 +
            Math.random() *
            0.002

    });
}


/* =========================================================
   DRAW GAME
========================================================= */

function drawGame() {

    const width =
        gameCanvas.width;

    const height =
        gameCanvas.height;


    gameCtx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
        PLAYER
    */

    const px =
        player.x *
        width;

    const py =
        player.y *
        height;


    gameCtx.beginPath();


    gameCtx.arc(
        px,
        py,
        player.radius,
        0,
        Math.PI * 2
    );


    gameCtx.fillStyle =
        "rgba(0, 200, 255, 0.85)";


    gameCtx.fill();


    gameCtx.lineWidth = 4;

    gameCtx.strokeStyle =
        "white";


    gameCtx.stroke();


    /*
        TARGETS
    */

    for (
        const target
        of targets
    ) {

        const x =
            target.x *
            width;

        const y =
            target.y *
            height;


        const radius = 22;


        gameCtx.beginPath();


        gameCtx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );


        gameCtx.fillStyle =
            "rgba(255, 70, 100, 0.9)";


        gameCtx.fill();


        gameCtx.lineWidth = 3;

        gameCtx.strokeStyle =
            "white";


        gameCtx.stroke();
    }
}


/* =========================================================
   BUTTON EVENTS
========================================================= */

startButton.addEventListener(
    "click",
    startCamera
);


flipButton.addEventListener(
    "click",
    flipCamera
);


pauseButton.addEventListener(
    "click",
    togglePause
);


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    resizeCanvases
);