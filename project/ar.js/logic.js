const UNIT = 0.3
const SPACER = 1.25
const SCALE = .7

currentWay = undefined
lastTime = 0
delay = 500

//////////////////////////////////////////////////////////////////////////////////
//		add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

var arWorldRoot = smoothedRoot

var geometry = new THREE.CubeGeometry(UNIT, UNIT, UNIT);
var materialBlue = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x5362d2),
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
});
var materialYellow = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xd2ca53),
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
});
var materialGreen = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x44bba4),
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
});
var materialPurple = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xa020f0),
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
});

let loader = new THREE.TextureLoader();
let materialArray = [
    // new THREE.MeshBasicMaterial({
    //     map: loader.load("images/xpos.png")
    // }),
    materialBlue,
    materialBlue,
    materialBlue,
    materialBlue,
    materialBlue,
    materialBlue,
];


let materialArrayUp = [].concat(materialArray)
materialArrayUp[2] = new THREE.MeshBasicMaterial({
    map: loader.load("images/yposUp.png")
})

// var meshUp = new THREE.Mesh(geometry, materialBlue);
var meshUp = new THREE.Mesh(geometry, materialArrayUp);
meshUp.position.x = -5 * UNIT
meshUp.position.z = -2 * UNIT
meshUp.name = "meshUp"
meshUp.scale.x = 3 * SCALE;
meshUp.scale.y = 3 * SCALE;
meshUp.scale.z = 3 * SCALE;
arWorldRoot.add(meshUp);

materialArrayDown = [].concat(materialArray)
materialArrayDown[2] = new THREE.MeshBasicMaterial({
    map: loader.load("images/yposDown.png")
})

// var meshDown = new THREE.Mesh(geometry, materialYellow);
var meshDown = new THREE.Mesh(geometry, materialArrayDown);
meshDown.position.x = -5 * UNIT
meshDown.position.z = 2 * UNIT
meshDown.name = "meshDown"
meshDown.scale.x = 3 * SCALE;
meshDown.scale.y = 3 * SCALE;
meshDown.scale.z = 3 * SCALE;
arWorldRoot.add(meshDown);

materialArrayRight = [].concat(materialArray)
materialArrayRight[2] = new THREE.MeshBasicMaterial({
    map: loader.load("images/yposRight.png")
})

// var meshRight = new THREE.Mesh(geometry, materialGreen);
var meshRight = new THREE.Mesh(geometry, materialArrayRight);
meshRight.position.x = 8 * UNIT
meshRight.position.z = 0 * UNIT
meshRight.name = "meshRight"
meshRight.scale.x = 3 * SCALE;
meshRight.scale.y = 3 * SCALE;
meshRight.scale.z = 3 * SCALE;
arWorldRoot.add(meshRight);


materialArrayLeft = [].concat(materialArray)
materialArrayLeft[2] = new THREE.MeshBasicMaterial({
    map: loader.load("images/yposLeft.png")
})
var meshLeft = new THREE.Mesh(geometry, materialArrayLeft);
meshLeft.position.x = 4 * UNIT
meshLeft.position.z = 0 * UNIT
meshLeft.name = "meshLeft"
meshLeft.scale.x = 3 * SCALE;
meshLeft.scale.y = 3 * SCALE;
meshLeft.scale.z = 3 * SCALE;
arWorldRoot.add(meshLeft);


// main loop
onRenderFcts.push(function () {
    if (clicked1) {
        mesh1.rotation.x += 0.1
    }
    if (clicked2) {
        mesh2.rotation.x += 0.1
    }

    if (currentWay) {
        let now = new Date().getTime()
        if (now - lastTime >= delay) {
            lastTime = now
            switch (currentWay) {
                case 'r':
                    goRight()
                    break;
                case 'l':
                    goLeft()
                    break;
                case 'u':
                    goUp()
                    break;
                case 'd':
                    goDown()
                    break;
                default:
                    break;
            }
        }
    }
})

clicked1 = false;
clicked2 = false;

function enableRotateBox1() {
    clicked1 = !clicked1
}

function enableRotateBox2() {
    clicked2 = !clicked2
}

function setLeft() {
    if (currentWay != "r")
        currentWay = "l"
}

function setRight() {
    if (currentWay != "l")
        currentWay = "r"
}

function setUp() {
    if (currentWay != "d")
        currentWay = "u"
}

function setDown() {
    if (currentWay != "u")
        currentWay = "d"
}

function goLeft() {
    let currentMesh
    for (let index = globalMesh.length - 1; index >= 0; index--) {
        currentMesh = globalMesh[index]
        if (index == 0) {
            currentMesh.position.x -= UNIT;
        } else {
            copyPosition(currentMesh, globalMesh[index - 1]);
        }
    }
}

function goRight() {
    let currentMesh
    for (let index = globalMesh.length - 1; index >= 0; index--) {
        currentMesh = globalMesh[index]
        if (index == 0) {
            currentMesh.position.x += UNIT;
        } else {
            copyPosition(currentMesh, globalMesh[index - 1]);
        }
    }
}

function goUp() {
    for (let index = globalMesh.length - 1; index >= 0; index--) {
        currentMesh = globalMesh[index]
        if (index == 0) {
            currentMesh.position.z -= UNIT
        } else {
            copyPosition(currentMesh, globalMesh[index - 1]);
        }
    }
}

function goDown() {
    for (let index = globalMesh.length - 1; index >= 0; index--) {
        currentMesh = globalMesh[index]
        if (index == 0) {
            currentMesh.position.z += UNIT
        } else {
            currentMesh.position.x = globalMesh[index - 1].position.x
            currentMesh.position.y = globalMesh[index - 1].position.y
            currentMesh.position.z = globalMesh[index - 1].position.z
        }
    }
}

function copyPosition(currentMesh, nextMesh) {
    currentMesh.position.x = nextMesh.position.x;
    currentMesh.position.y = nextMesh.position.y;
    currentMesh.position.z = nextMesh.position.z;
}

globalMesh = [];
(function addingObjectOnScene() {
    for (let index = 0; index < 4; index++) {
        let mesh = new THREE.Mesh(geometry, materialGreen);
        mesh.position.x = UNIT * SPACER * index
        mesh.position.x = UNIT * index
        mesh.position.z = 1
        mesh.scale.x = 1 * SCALE;
        mesh.scale.y = 1 * SCALE;
        mesh.scale.z = 1 * SCALE;
        mesh.name = "mesh" + index

        arWorldRoot.add(mesh);
        globalMesh.push(mesh)
    }
})()