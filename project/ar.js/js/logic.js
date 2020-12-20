const UNIT = 0.1;
const SPACER = 2;
const SCALE = 0.9;
const SNAKE_INIT_SIZE = 6;
const RANGE_LIMIT = 2;

var currentWay = undefined;
var currentSnakeSize = 0;
var lastTime = 0;
var delay = 300;
var snakeMesh = [];
var meshObstacle;

var enabledControls = true;
var meshUp;
var meshDown;
var meshLeft;
var meshRight;
var score = 0;

//////////////////////////////////////////////////////////////////////////////////
//		add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

var arWorldRoot = smoothedRoot;

var geometry = new THREE.CubeGeometry(UNIT, UNIT, UNIT);
var materialBlue = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0x5362d2),
  transparent: true,
  opacity: 0.85,
  side: THREE.DoubleSide,
});
var materialYellow = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0xd2ca53),
  transparent: true,
  opacity: 0.85,
  side: THREE.DoubleSide,
});
var materialGreen = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0x44bba4),
  transparent: true,
  opacity: 0.85,
  side: THREE.DoubleSide,
});
var materialPurple = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0xa020f0),
  transparent: true,
  opacity: 0.85,
  side: THREE.DoubleSide,
});
var materialRgb = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0.85,
  side: THREE.DoubleSide,
});

function createControls() {
  let materialArray = [materialBlue, materialBlue, materialBlue, materialBlue, materialBlue, materialBlue];

  let materialArrayUp = [].concat(materialArray);

  meshUp = new THREE.Mesh(geometry, materialArrayUp);
  meshUp.position.x = -5 * UNIT;
  meshUp.position.y = 1 * UNIT;
  meshUp.position.z = -2 * UNIT;
  meshUp.name = 'meshUp';
  meshUp.scale.x = 3 * SCALE;
  meshUp.scale.y = 3 * SCALE;
  meshUp.scale.z = 3 * SCALE;

  var materialArrayDown = [].concat(materialArray);
  meshDown = new THREE.Mesh(geometry, materialArrayDown);
  meshDown.position.x = -5 * UNIT;
  meshDown.position.y = 1 * UNIT;
  meshDown.position.z = 2 * UNIT;
  meshDown.name = 'meshDown';
  meshDown.scale.x = 3 * SCALE;
  meshDown.scale.y = 3 * SCALE;
  meshDown.scale.z = 3 * SCALE;

  var materialArrayRight = [].concat(materialArray);
  meshRight = new THREE.Mesh(geometry, materialArrayRight);
  meshRight.position.x = 8 * UNIT;
  meshRight.position.y = 1 * UNIT;
  meshRight.position.z = 0 * UNIT;
  meshRight.name = 'meshRight';
  meshRight.scale.x = 3 * SCALE;
  meshRight.scale.y = 3 * SCALE;
  meshRight.scale.z = 3 * SCALE;

  var materialArrayLeft = [].concat(materialArray);
  meshLeft = new THREE.Mesh(geometry, materialArrayLeft);
  meshLeft.position.x = 4 * UNIT;
  meshLeft.position.y = 1 * UNIT;
  meshLeft.position.z = 0 * UNIT;
  meshLeft.name = 'meshLeft';
  meshLeft.scale.x = 3 * SCALE;
  meshLeft.scale.y = 3 * SCALE;
  meshLeft.scale.z = 3 * SCALE;

  let queryParams = new URLSearchParams(window.location.search);
  if (queryParams.has('controls')) {
    toggleControls();
  }
}

createControls();

function toggleControls() {
  if (enabledControls) {
    arWorldRoot.add(meshUp);
    arWorldRoot.add(meshDown);
    arWorldRoot.add(meshRight);
    arWorldRoot.add(meshLeft);
    enabledControls = !enabledControls;
  } else {
    arWorldRoot.remove(meshUp);
    arWorldRoot.remove(meshDown);
    arWorldRoot.remove(meshRight);
    arWorldRoot.remove(meshLeft);
    enabledControls = !enabledControls;
  }
}

function createObstacleOnScene() {
  meshObstacle = new THREE.Mesh(geometry, materialRgb);
  meshObstacle.position.x = UNIT * getRandomValueInsideRange();
  meshObstacle.position.y = UNIT * 1;
  meshObstacle.position.z = UNIT * getRandomValueInsideRange();
  meshObstacle.scale.x = 1 * SCALE;
  meshObstacle.scale.y = 1 * SCALE;
  meshObstacle.scale.z = 1 * SCALE;
  meshObstacle.name = 'meshObstacle';

  arWorldRoot.add(meshObstacle);
}
createObstacleOnScene();

function mainLoop() {
  keepObstacleRotation();

  let now = new Date().getTime();
  if (now - lastTime >= delay) {
    lastTime = now;

    setDirectionOfSnake();
    verifyHeadObstacleColision();
    verifyHeadSnakeColision();
  }
}
onRenderFcts.push(mainLoop);

function keepObstacleRotation() {
  meshObstacle.rotation.x += 0.01;
  meshObstacle.rotation.y += 0.0001;
}

function setDirectionOfSnake() {
  if (currentWay) {
    switch (currentWay) {
      case 'r':
        goRight();
        break;
      case 'l':
        goLeft();
        break;
      case 'u':
        goUp();
        break;
      case 'd':
        goDown();
        break;
      default:
        break;
    }
  }
}

function verifyHeadObstacleColision() {
  let snakeHead = snakeMesh[0];
  let snakeX = to2Decimal(snakeHead.position.x);
  let snakeZ = to2Decimal(snakeHead.position.z);

  let obstacleX = to2Decimal(meshObstacle.position.x);
  let obstacleZ = to2Decimal(meshObstacle.position.z);

  let sameX = snakeX == obstacleX;
  let sameZ = snakeZ == obstacleZ;

  let consolable = `
    <br>
    snakeX ${snakeX}
    <br>
    snakeZ ${snakeZ}
    <br>
    obstacleX ${obstacleX}
    <br>
    obstacleZ ${obstacleZ}
    <br>
    sameX ${sameX}
    <br>
    sameZ ${sameZ}
    <br>
    `;

  // document.getElementById('console').innerHTML = consolable;

  let isSnakeHeadeCollidedObstacle = sameX && sameZ;
  if (isSnakeHeadeCollidedObstacle) {
    let newObstacleX = UNIT * getRandomInt(-3, 3);
    let newObstacleZ = UNIT * getRandomInt(-3, 3);
    meshObstacle.position.x = newObstacleX;
    meshObstacle.position.z = newObstacleZ;

    createExtraPiece();
    document.getElementById('score').innerHTML = `Score: ${++score}`;
  }
}

function verifyHeadSnakeColision() {
  let snakeHead = snakeMesh[0];
  let snakeHeadX = to2Decimal(snakeHead.position.x);
  let snakeHeadZ = to2Decimal(snakeHead.position.z);

  let isSnakeHeadeCollidedSnake = false;

  snakeMesh.forEach((snakePiece, index) => {
    if (index != 0) {
      let x = to2Decimal(snakePiece.position.x);
      let z = to2Decimal(snakePiece.position.z);

      let sameX = snakeHeadX == x;
      let sameZ = snakeHeadZ == z;

      isSnakeHeadeCollidedSnake = isSnakeHeadeCollidedSnake || (sameX && sameZ);
    }
  });

  if (isSnakeHeadeCollidedSnake) {
    snakeMesh.forEach((snakePiece) => {
      snakePiece.material = materialPurple;
    });
    resetSnake();
    Swal.fire({
      title: 'You lost!',
      icon: 'error',
      timer: 3000,
      showConfirmButton: false,
    });
  }
}

function setLeft() {
  if (currentWay != 'r') currentWay = 'l';
}

function setRight() {
  if (currentWay != 'l') currentWay = 'r';
}

function setUp() {
  if (currentWay != 'd') currentWay = 'u';
}

function setDown() {
  if (currentWay != 'u') currentWay = 'd';
}

function goLeft() {
  let currentMesh;
  for (let index = snakeMesh.length - 1; index >= 0; index--) {
    currentMesh = snakeMesh[index];
    if (index == 0) {
      currentMesh.position.x = to2Decimal(currentMesh.position.x - UNIT);
    } else {
      copyPosition(currentMesh, snakeMesh[index - 1]);
    }
  }
}

function goRight() {
  let currentMesh;
  for (let index = snakeMesh.length - 1; index >= 0; index--) {
    currentMesh = snakeMesh[index];
    if (index == 0) {
      currentMesh.position.x = to2Decimal(currentMesh.position.x + UNIT);
    } else {
      copyPosition(currentMesh, snakeMesh[index - 1]);
    }
  }
}

function goUp() {
  for (let index = snakeMesh.length - 1; index >= 0; index--) {
    currentMesh = snakeMesh[index];
    if (index == 0) {
      currentMesh.position.z = to2Decimal(currentMesh.position.z - UNIT);
    } else {
      copyPosition(currentMesh, snakeMesh[index - 1]);
    }
  }
}

function goDown() {
  for (let index = snakeMesh.length - 1; index >= 0; index--) {
    currentMesh = snakeMesh[index];
    if (index == 0) {
      currentMesh.position.z = to2Decimal(currentMesh.position.z + UNIT);
    } else {
      copyPosition(currentMesh, snakeMesh[index - 1]);
    }
  }
}

function to2Decimal(value) {
  return Math.round(value * 10) / 10;
}

function copyPosition(currentMesh, nextMesh) {
  currentMesh.position.x = nextMesh.position.x;
  currentMesh.position.y = nextMesh.position.y;
  currentMesh.position.z = nextMesh.position.z;
}

function createSnakeOnScene() {
  for (let index = 0; index < SNAKE_INIT_SIZE; index++) {
    createSnakePiece(index);
  }
}
createSnakeOnScene();

function createSnakePiece(index) {
  let mesh = new THREE.Mesh(geometry, index === 0 ? materialBlue : materialGreen);
  mesh.position.x = UNIT * index;
  mesh.position.y = UNIT * 1;
  mesh.position.z = UNIT * 1;
  mesh.scale.x = 1 * SCALE;
  mesh.scale.y = 1 * SCALE;
  mesh.scale.z = 1 * SCALE;
  mesh.name = 'mesh' + index;
  arWorldRoot.add(mesh);
  snakeMesh.push(mesh);

  currentSnakeSize++;
}

function createExtraPiece() {
  let mesh = new THREE.Mesh(geometry, materialGreen);
  copyPosition(mesh, snakeMesh[currentSnakeSize - 1]);
  mesh.scale.x = 1 * SCALE;
  mesh.scale.y = 1 * SCALE;
  mesh.scale.z = 1 * SCALE;
  mesh.name = 'mesh' + currentSnakeSize;
  arWorldRoot.add(mesh);
  snakeMesh.push(mesh);

  currentSnakeSize++;
}

function resetSnake() {
  currentWay = '';
  currentSnakeSize = 0;
  score = 0;
  document.getElementById('score').innerHTML = `Score: ${score}`;
  snakeMesh = [];

  for (var i = arWorldRoot.children.length - 1; i >= 0; i--) {
    arWorldRoot.remove(arWorldRoot.children[i]);
  }

  createSnakeOnScene();
  createObstacleOnScene();
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomValueInsideRange() {
  return getRandomInt(-RANGE_LIMIT, RANGE_LIMIT);
}
