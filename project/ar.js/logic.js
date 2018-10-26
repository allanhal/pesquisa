const UNIT = 0.3

const SPACER = 1.25

//////////////////////////////////////////////////////////////////////////////////
//		add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

var arWorldRoot = smoothedRoot

var geometry = new THREE.CubeGeometry(UNIT, UNIT, UNIT);
var material1 = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x5362d2),
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
});
var material2 = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xd2ca53),
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
});
var material3 = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xce2149),
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
});
var mesh1 = new THREE.Mesh(geometry, material1);
mesh1.position.x = -(geometry.parameters.width / 2)
mesh1.position.y = geometry.parameters.height / 2
mesh1.name = "mesh1"

var mesh2 = new THREE.Mesh(geometry, material2);
mesh2.position.x = (geometry.parameters.width / 2)
mesh2.position.y = geometry.parameters.height / 2
mesh2.name = "mesh2"

arWorldRoot.add(mesh1);
arWorldRoot.add(mesh2);


// main loop
onRenderFcts.push(function () {
    if (clicked1) {
        mesh1.rotation.x += 0.1
    }
    if (clicked2) {
        mesh2.rotation.x += 0.1
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

function goLeft() {
    let currentMesh
    for (let index = globalMesh.length - 1; index >= 0; index--) {
        currentMesh = globalMesh[index]
        if (index == 0) {
            currentMesh.position.x -= UNIT;
        } else {
            currentMesh.position.x = globalMesh[index - 1].position.x
            currentMesh.position.y = globalMesh[index - 1].position.y
            currentMesh.position.z = globalMesh[index - 1].position.z
        }
    }
    mesh1.position.x -= UNIT;
}

function goRight() {
    let currentMesh
    for (let index = globalMesh.length - 1; index >= 0; index--) {
        currentMesh = globalMesh[index]
        if (index == 0) {
            currentMesh.position.x += UNIT;
        } else {
            currentMesh.position.x = globalMesh[index - 1].position.x
            currentMesh.position.y = globalMesh[index - 1].position.y
            currentMesh.position.z = globalMesh[index - 1].position.z
        }
    }

    mesh1.position.x += UNIT
}

function goUp() {
    for (let index = globalMesh.length - 1; index >= 0; index--) {
        currentMesh = globalMesh[index]
        if (index == 0) {
            currentMesh.position.z -= UNIT
        } else {
            currentMesh.position.x = globalMesh[index - 1].position.x
            currentMesh.position.y = globalMesh[index - 1].position.y
            currentMesh.position.z = globalMesh[index - 1].position.z
        }
    }

    mesh1.position.z -= UNIT
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
    mesh1.position.z += UNIT
}

function getLastMesh() {
    return globalMesh.slice(-1)[0]
}

globalMesh = [];
(function addingObjectOnScene() {
    for (let index = 0; index < 4; index++) {
        let mesh = new THREE.Mesh(geometry, material3);
        mesh.position.x = UNIT * SPACER * index
        mesh.position.x = UNIT * index
        mesh.position.z = 1
        mesh.name = "mesh" + index

        arWorldRoot.add(mesh);
        globalMesh.push(mesh)
    }
})()